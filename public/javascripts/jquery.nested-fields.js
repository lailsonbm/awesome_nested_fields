(function($) {
  
  var defaultSettings = {
    beforeInsert: function(item, callback) { callback() },
    afterInsert: function(item) {},
    beforeRemove: function(item, callback) { callback() },
    afterRemove: function(item) {},
    itemTemplate: '.item.template',
    noneTemplate: '.none.template',
    container: '.container',
    item: '.item',
    none: '.none',
    addHandler: '.add',
    removeHandler: '.remove',
    newItemIndex: 'new_nested_item'
  };
  
  // PUBLIC API
  var methods = {
    init: function(options) {
      var $this = $(this);
      if($(this).data('nested-fields.options')) {
        console.log('Nested fields already defined for this element. If you want to redefine options, destroy it and init again.');
        return $this;
      } else if(getOptions($this)) {
        console.log('You cannot nest nested fields. Who would say that, uh?');
        return $this;
      }
      
      options = $.extend({}, defaultSettings, options);
      options.itemTemplate = $(options.itemTemplate, $this);
      options.noneTemplate = $(options.noneTemplate, $this);
      options.container = $(options.container, $this);
      options.addHandler = $(options.addHandler, $this);
      $this.data('nested-fields.options', options); 
      
      options.addHandler.bind('click.nested-fields', function(e) {
        e.preventDefault();
        var newItem = prepareTemplate(options);
        insertItemWithCallbacks(newItem, null, options);
      });
      
      $(options.item, options.container).each(function(i, item) {
        bindRemoveEvent(item, options);
      });
      
      return $this;
    },
    
    insert: function(callback) {
      var options = getOptions(this);
      var newItem = prepareTemplate(options);
      insertItemWithCallbacks(newItem, callback, options);
    },
    
    remove: function(element) {
      return removeItem(element, getOptions(this));
    },
    
    items: function() {
      return findItems(getOptions(this));
    },
    
    destroy: function() {
      $(this).removeData('nested-fields.options');
      $('*', this).unbind('.nested-fields');
    }
  };
  
  $.fn.nestedFields = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.nestedFields' );
    }
  };
  
  function getOptions(element) {
    element = $(element);
    while(element.length > 0) {
      var data = element.data('nested-fields.options');
      if(data) {
        return data;
      } else {
        element = element.parent();
      }
    }
    return null;
  }
  
  function prepareTemplate(options) {
    var regexp = new RegExp(options.newItemIndex, 'g');
    var newId = new Date().getTime();
    
    var contents = options.itemTemplate.html();
    var newItem = $(contents.replace(regexp, newId));
    newItem.attr('data-new-record', true);
    newItem.attr('data-record-id', newId);
    
    bindRemoveEvent(newItem, options);
    
    return newItem;
  }
  
  function insertItem(newItem, options) {
    removeNone(options);
    options.container.append(newItem);
  }
  
  function insertItemWithCallbacks(newItem, onInsertCallback, options) {
    options.beforeInsert(newItem, function() {
      if(onInsertCallback) {
        onInsertCallback(item);
      }
      insertItem(newItem, options);
    });
    options.afterInsert(newItem);
    
    return newItem;
  }
  
  function removeItem(element, options) {
    var $element = $(element);
    options.beforeRemove($element, function() {
      if($element.attr('data-new-record')) { // record is new
        $element.remove();
      } else { // record should be marked and sent to server
        $element.find('INPUT[name*=_destroy]').val('true');
        $element.hide();
      }
      insertNone(options);
    });
    options.afterRemove($element);
    return $element;
  }
  
  function bindRemoveEvent(item, options) {
    $(item).find(options.removeHandler).bind('click.nested-fields', function(e) {
      e.preventDefault();
      removeItem(item, options);
    });
  }
  
  function insertNone(options) {
    if(findItems(options).length == 0) {
      options.container.append(options.noneTemplate.html());
    }
  }
  
  function removeNone(options) {
    findNone(options).remove();
  }
  
  function findItems(options) {
    return options.container.find(options.item + ':visible');
  }
  
  function findNone(options) {
    return options.container.find(options.none);
  }
  
})(jQuery);
