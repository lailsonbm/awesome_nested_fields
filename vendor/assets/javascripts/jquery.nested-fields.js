(function($) {
  /**
   *
   * Awesome Nested Fields
   *
   * Requires jquery-ujs adapter.
   * https://github.com/lailsonbm/awesome_nested_fields
   *
   */
   
  var defaultSettings = {
    beforeInsert: function(item, callback) { callback() },
    afterInsert: function(item) {},
    beforeRemove: function(item, callback) { callback() },
    afterRemove: function(item) {},
    itemTemplateSelector: '.item.template',
    emptyTemplateSelector: '.empty.template',
    containerSelector: '.container',
    itemSelector: '.item',
    emptySelector: '.empty',
    addSelector: '.add',
    removeSelector: '.remove',
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
      options.itemTemplate = $(options.itemTemplateSelector, $this);
      options.emptyTemplate = $(options.emptyTemplateSelector, $this);
      options.container = $(options.containerSelector, $this);
      options.add = $(options.addSelector, $this);
      $this.data('nested-fields.options', options); 
      
      options.add.bind('click.nested-fields', function(e) {
        e.preventDefault();
        var newItem = prepareTemplate(options);
        insertItemWithCallbacks(newItem, null, options);
      });
      
      $(options.itemSelector, options.containerSelector).each(function(i, item) {
        bindRemoveEvent(item, options);
      });
      
      return $this;
    },
    
    insert: function(callback, options) {
      options = $.extend({}, getOptions(this), options);
      var newItem = prepareTemplate(options);
      
      insertItemWithCallbacks(newItem, callback, options);
    },
    
    remove: function(element, options) {
      options = $.extend({}, getOptions(this), options);
      return removeItem(element, options);
    },
    
    removeAll: function(options) {
      options = $.extend({}, getOptions(this), options);
      $(methods.items.apply(this)).each(function(i, el) {
        methods.remove(el, options);
      });
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
    removeEmpty(options);
    options.container.append(newItem);
  }
  
  function insertItemWithCallbacks(newItem, onInsertCallback, options) {  
    function insert() {
      if(onInsertCallback) {
        onInsertCallback(newItem);
      }
      insertItem(newItem, options);
    }
    
    if(!options.skipBefore) {
      options.beforeInsert(newItem, insert);
    } else {
      insert();
    }
    
    if(!options.skipAfter) {
      options.afterInsert(newItem);
    }
    
    return newItem;
  }
  
  function removeItem(element, options) {
    function remove() {
      if($element.attr('data-new-record')) { // record is new
        $element.remove();
      } else { // record should be marked and sent to server
        $element.find("INPUT[name$='[_destroy]']").val('true');
        $element.hide();
      }
      insertNone(options);
    }
    
    var $element = $(element);
    if(!options.skipBefore) {
      options.beforeRemove($element, remove);
    } else {
      remove();
    }
    
    if(!options.skipAfter) {
      options.afterRemove($element);
    }
    
    return $element;
  }
  
  function bindRemoveEvent(item, options) {
    var removeHandler = $(item).find(options.removeSelector);
    var needsConfirmation = removeHandler.attr('data-confirm');
    
    var event = needsConfirmation ? 'confirm:complete' : 'click';
    removeHandler.bind(event + '.nested-fields', function(e, confirmed) {
      e.preventDefault();
      if(confirmed === undefined || confirmed === true) {
        removeItem(item, options);
      }
    });
  }
  
  function insertNone(options) {
    if(findItems(options).length === 0) {
      options.container.append(options.emptyTemplate.html());
    }
  }
  
  function removeEmpty(options) {
    findEmpty(options).remove();
  }
  
  function findItems(options) {
    return options.container.find(options.itemSelector + ':visible');
  }
  
  function findEmpty(options) {
    return options.container.find(options.emptySelector);
  }
  
})(jQuery);
