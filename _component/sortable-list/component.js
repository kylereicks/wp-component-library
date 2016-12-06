(function( window, document ) {

	// Enable strict mode
	'use strict';

	var sortableLists = document.getElementsByClassName( 'sortable-list' ),
	makeListSortable = function( listContainer ) {
		var eventHandlers = {};
		eventHandlers.dragstart = function(event) {
			var draggedItemIndex = [].indexOf.call( this.parentNode.childNodes, this );
			[].forEach.call( this.parentNode.childNodes, function( childNode, itemIndex ) {
				if ( ! childNode.classList ) {
					return;
				}
				if ( itemIndex < draggedItemIndex ) {
					childNode.classList.add( 'above-dragged-item' );
				}else if ( itemIndex > draggedItemIndex ) {
					childNode.classList.add( 'below-dragged-item' );
				}
			});
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData( 'text',  draggedItemIndex );
		};
		eventHandlers.dragenter = function(event) {
			var self = this;
			if ( ! this.classList.contains( 'dragging' ) ) {
				this.classList.add( 'dragover' );
			}
			[].forEach.call( this.parentNode.childNodes, function( childNode ) {
				if ( childNode.classList && childNode !== self ) {
					childNode.classList.remove( 'dragover' );
				}
			});
		};
		eventHandlers.dragleave = function(event) {
			if ( this === event.target ) {
				this.classList.remove( 'dragover' );
			}
		};
		eventHandlers.dragend = function(event) {
			this.classList.remove( 'dragging' );
			[].forEach.call( this.parentNode.childNodes, function( childNode ) {
				if ( childNode.classList ) {
					childNode.classList.remove( 'dragging', 'dragover', 'above-dragged-item', 'below-dragged-item' );
				}
			});
		};
		eventHandlers.dragover = function(event) {
			event.preventDefault();
			if ( event.target.parentNode === listContainer && ! event.target.classList.contains( 'dragging' ) ) {
				event.dataTransfer.dropEffect = 'move';
			}
		};
		eventHandlers.drop = function(event) {
			var draggedItemIndex = event.dataTransfer.getData( 'text' );
			var draggedItem = this.parentNode.childNodes[ draggedItemIndex ];
			event.preventDefault();
			if ( draggedItem !== this ) {
				if (draggedItemIndex > [].indexOf.call( this.parentNode.childNodes, this ) ) {
					this.parentNode.insertBefore( draggedItem, this );
				}else if ( this.nextSibling ) {
					this.parentNode.insertBefore( draggedItem, this.nextSibling );
				}else {
					this.parentNode.appendChild( draggedItem );
				}
			}
			console.log([].filter.call( this.parentNode.childNodes, function(childNode) {
				if ( childNode.hasAttribute && childNode.hasAttribute( 'data-item-data' ) ) {
					return true;
				}
				return false;
			}).map(function( childNode ) {
				return childNode.getAttribute( 'data-item-data' ) ;
			}) );
		};

		[].forEach.call( listContainer.childNodes, function( listItem ) {
			var eventName = null;
			for ( eventName in eventHandlers ) {
				listItem.addEventListener( eventName, eventHandlers[eventName] );
			}
		});
	};

	[].forEach.call( sortableLists, makeListSortable );

})( window, document );
