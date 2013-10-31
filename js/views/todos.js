var app = app || {};
var initcounter = 0;
var rendcounter = 0;

  // Todo Item View
  // --------------

  // The DOM element for a todo item...
  app.TodoView = Backbone.View.extend({

    //... is a list tag.
    tagName: 'li',

    // Cache the template function for a single item.
    template: _.template( $('#item-template').html() ),

    // The DOM events specific to an item.
    events: {
      'click .toggle': 'togglecompleted', // NEW
      'dblclick label': 'edit',
      'click .destroy': 'clear',           // NEW
      'keypress .edit': 'updateOnEnter',
      'blur .edit': 'close'
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.

    initialize: function() { //upon adding a new todo item this is fired first
      console.log("TodoView.initialize() fired" + initcounter);
      initcounter += 1;
      //object.listenTo(other object, event, callback)
      this.listenTo(this.model, 'change', this.render); //fired second, the model has changed, call render function
      this.listenTo(this.model, 'destroy', this.remove);        // NEW
      this.listenTo(this.model, 'visible', this.toggleVisible); // NEW this visible event is from filterOne event in appView file
      
    },

    // Re-render the titles of the todo item.
    render: function() {
      console.log("TodoView.render() fired" + rendcounter);
      rendcounter += 1;
      this.$el.html( this.template( this.model.toJSON() ) );

      this.$el.toggleClass( 'completed', this.model.get('completed') ); // toggleClass is jQuery method
      this.toggleVisible();                                             // NEW

      this.$input = this.$('.edit');
      return this;
       
    },

    // NEW - Toggles visibility of item
    toggleVisible : function () {
      console.log("TodoView.toggleVisible() fired");
      this.$el.toggleClass( 'hidden',  this.isHidden());
      
    },

    // NEW - Determines if item should be hidden
    isHidden : function () {
      console.log("TodoView.isHidden() fired");
      var isCompleted = this.model.get('completed');
      return ( // hidden cases only
        (!isCompleted && app.TodoFilter === 'completed') || (isCompleted && app.TodoFilter === 'active')
      );
      
    },

    // NEW - Toggle the `"completed"` state of the model.
    togglecompleted: function() {
      console.log("TodoView.togglecompleted() fired");
      this.model.toggle();
      
    },

    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function() {
      console.log("TodoView.edit() fired");
      this.$el.addClass('editing');
      this.$input.focus();
      
    },

    // Close the `"editing"` mode, saving changes to the todo.
    close: function() {
      console.log("TodoView.close() fired");
      var value = this.$input.val().trim();

      if ( value ) {
        this.model.save({ title: value });
      } else {
        this.clear(); // NEW
      }

      this.$el.removeClass('editing');
      
    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function( e ) {
      console.log("TodoView.updateOnEnter() fired");
      if ( e.which === ENTER_KEY ) {
        this.close();
      }
      
    },

    // NEW - Remove the item, destroy the model from *localStorage* and delete its view.
    clear: function() {
      console.log("TodoView.clear() fired");
      this.model.destroy();
   
    }
  });