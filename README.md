Awesome Nested Fields [![Gem Version](https://badge.fury.io/rb/awesome_nested_fields.png)](http://badge.fury.io/rb/awesome_nested_fields)
=====================

In Rails, you can create forms that have fields from nested models. For example, if a person has many phone numbers, you can easily create a form that receives data from the person and from a fixed number of phones. However, when you want to allow the person to insert multiple, indefinite phones, you're in trouble: it's [much harder](http://railscasts.com/episodes/196-nested-model-form-part-1) [than it](http://railscasts.com/episodes/197-nested-model-form-part-2) [should be](http://stackoverflow.com/questions/1704142/unobtrusive-dynamic-form-fields-in-rails-with-jquery). Well, not anymore.


Installation
------------

### Rails 3.1

1. Add the gem to your Gemfile and run `bundle install` to make sure the gem gets installed.

```ruby
gem 'awesome_nested_fields'
```

2. Add this line to `app/assets/javascripts/application.js` (or where you prefer) so the javascript dependency is added to the asset pipeline. Be sure to include this line after jQuery and jQuery UJS Adapter.

```javascript
//= require jquery.nested-fields
```

3. Rock with your _awesome_ nested models.


### Rails 3.0

1. Add the gem to your Gemfile and run `bundle install` to make sure the gem gets installed. Be sure to include it after `jquery-rails` so the javascript files are added in the correct order at the templates.

```ruby
gem 'awesome_nested_fields'
```

2. Copy the javascript dependency to `public/javascripts` by using the generator.

  rails generate awesome_nested_fields:install

3. (Optional) The javascript dependency will be added automatically to the defaults javascript files. If you don't use `javascript_include_tag :defaults` in your templates for some reason, require the file manually.

```html
<script src="/javascripts/jquery.nested-fields.min.js" type="text/javascript"></script>
```

4. Now you're ready to rock with your _awesome_ nested models. It will be so fun as in Rails 3.1, I promise.


Basic Usage
-----------

### Model

First, make sure the object that has the `has_many` or `has_and_belongs_to_many` relation accepts nested attributes for the collection you want. For example, if a person _has_many_ phones, we'll have a model like this:

```ruby
class Person < ActiveRecord::Base
  has_many :phones
  accepts_nested_attributes_for :phones, allow_destroy: true
end
```

The `accepts_nested_attributes_for` is a method from Active Record that allows you to pass attributes of nested models directly to its parent, instead of instantiate each child object separately. In this case, `Person` gains a method called `phones_attributes=`, that accepts data for new and existing phones of a given person. The `allow_destroy` option enables us to also delete child objects. To know more about nested attributes, check out the [ActiveRecord::NestedAttribute](https://github.com/rails/rails/blob/master/activerecord/lib/active_record/nested_attributes.rb#L1) class.

### View

The next step is set up the form view with the `nested_fields_for` method. It receives the association/collection name, an optional hash of options (humm, a pun) and a block with the nested fields. Proceeding with the person/phones example, we can have a form like this:

```erb
<%= form_for(@person) do |f| %>
  <% # person fields... %>

  <h2>Phones</h2>
  <div class="items">
    <%= f.nested_fields_for :phones do |f| %>
      <fieldset class="item">
        <%= f.label :number %>
        <%= f.text_field :number %>

        <a href="#" class="remove">remove</a>

        <%= f.hidden_field :id %>
        <%= f.hidden_field :_destroy %>
      </fieldset>
    <% end %>
  </div>
  <a href="#" class="add">add phone</a>

  <% # more person fields... %>
<% end %>
```

The `nested_fields_for` method lists the phones this person has and also adds an empty template to the page for creating new phones. (Actually, there is too much code inside the block. If you're not working with a simple example like this you better extract this code into a partial and call just `render :phones` inside the block. Good coding practices, you know.)

If you're paying attention, you noticed the key elements are marked with special class names. We *need* this for the javascript code, so it knows what to do with each HTML element: the one that have the children must have the class `items`; each child must be marked with the class `item`; inside an item, the link for removal must have the class `remove`; and the link to add new items must have the class `add`. We can change the names later, but these are the default choices. Finally, don't forget to add the `id` field, as it is needed by AR to identify whether this is an existing or a new element, and the `_destroy` field  to activate deletion when the user clicks on the remove link.

### Javascript

This is the easiest part: just activate the nested fields actions when the page loads. We can put this in the `application.js` file (or in any other place that gets executed in the page):

```javascript
$(document).ready(function(e) {
  $('FORM').nestedFields();
});
```

Now enjoy your new nested model form!


Reference
---------

### View Options

There are some view options, but most are internal. There is just one you really need to know about; for the others, go to the code.

#### show_empty

Sometimes you want to show something when the collection is empty. Just set `show_empty` to `true` and prepare the block to receive `nil` when the collection is empty. Awesome nested fields will take care to show the empty message when there are no elements and remove it when one is added.
To implement this on the basic example, do something like:

```erb
<%= f.nested_fields_for :phones, show_empty: true do |f| %>
  <% if f %>
    <% fields code... %>
  <% else %>
    <p class="empty">There are no phones.</p>
  <% end %>
<% end %>
```

And yeah, you need to mark it with the class `empty` or any other selector configured via javascript.

#### render_template

When `nested_fields_for` is called, it also includes a `<script>` tag with the html template of a new item, so the javascript code knows what to insert. But sometimes it is not possible to put the template just after the items. For example, you can be inside a table (tables cannot have script elements inside it) or have multi-level nested items (the templates would be recursively repeated). In these cases you need to render the template manually.

To do this, just set the `render_template` option to `false` and use the `nested_fields_template` helper to put the templates anywhere on the page.

```erb
<%= f.nested_fields_for :phones, render_template: false do |f| %>
  <% nested field code %>
<% end %>
<!-- some lines after -->
<%= nested_fields_templates %>
```

Keep in mind that you can call the templates only after `nested_fields_for` and inside the DOM element you apply the `nestedFields()` javascript, so it still can find the templates.

### Javascript Options

#### Selectors

To make nested fields work dynamically, the JS code needs to know what elements to use. By default, this is made by marking key elements with CSS classes, but you can use other selectors (any valid jQuery selector will do). The available options are shown below.

* `itemSelector` marks each item from the collection (`.item` by default)
* `containerSelector` marks the element that contains the items (`.items` by default). You can also use `.container` by default, but beware this class name conflicts with many CSS frameworks (Blueprint, 960.gs, Bootstrap, Foundation, ...)
* `addSelector` marks the element that will add a new item to the container when clicked (`.add` by default)
* `removeSelector` marks the element inside an item that will remove it when clicked (`.remove` by default)
* `emptySelector` marks the element that is shown when there are no items; used in conjunction with `show_empty` option (`.empty` by default)

For example, if you are using nested fields inside a table, you can do:

```javascript
element.nestedFields({
  containerSelector: 'tbody',
  itemSelector: 'tr'
});
```

#### Callbacks

Actions can be executed before or after items get inserted or removed. There are four callbacks available: `beforeInsert`, `afterInsert`, `beforeRemove` and `afterRemove`. All of them receive the item as the first parameter, so you can query or modify it before the operation.

```javascript
element.nestedFields({
  beforeInsert: function(item) {
    item.css('color', 'red'); // Make some operation
    console.log(item + ' will be inserted.')
  },
  afterRemove: function(item) {
    console.log(item + ' was removed.');
  }
});
```

The before callbacks also allow you to control when the element will be inserted or removed, so you can perform async operations (ajax, of course!) or choose to not insert or remove the element at all if some condition is not met. Just receive a second parameter as the handler function.

```javascript
element.nestedFields({
  beforeInsert: function(item, insert) {
    $.get('/ajax_function', function() {
      insert();
    });
  }
});
```


### Javascript API

It is possible to control nested fields programmatically using a jQuery-style API.

```javascript
element.nestedFields('insert', function(item) {
  // Make some operation with item
}, {skipBefore: true});
```

The code above inserts a new item and does not execute the `beforeInsert` callback function. The complete list of available methods is shown below.

* `insert(callback, options)` inserts a new item in the container. The `callback` function is executed just before the item is inserted. There are two available options: `skipBefore` and `skipAfter`. Both arguments are optional.
* `remove(element, options)` removes `element` from the container. There are two available options: `skipBefore` and `skipAfter`. The last argument is optional.
* `removeAll(options)` removes all elements from the container. There are two available options: `skipBefore` and `skipAfter`. The argument is optional.
* `items()` returns a list of items on the container.
* `destroy()` deactivates nested fields for the element.

These methods can be called from the element where nested fields are applied (e.g. a form) or from any element inside it (e.g. an input or the container itself).


More on the Wiki
----------------

Check out the wiki to know how to put Multiple Nested Fields on the same page or how to create Multi-level Nested Fields.


Demo
----

There is a live demo at http://phonebook.guava.com.br/.

You can find the demo code at https://github.com/lailsonbm/awesome_nested_fields_demo.


Compatibility
-------------

awesome_nested_fields works only with jQuery and Rails 3.x. Sorry, Rails 2.x users. Tested with ActiveRecord and Mongoid (but should work wherever `accepts_nested_fields` method is available).


Contributors
------------

* Chris Parker ([mrcsparker](https://github.com/mrcsparker))
* Juliana Lucena ([julianalucena](https://github.com/julianalucena))
* Rodrigo Vieira ([rodrigoalvesvieira](https://github.com/rodrigoalvesvieira))

TODO
----

* Write more tests
* Make sure it can degrade gracefully
* Implement jQuery autoload
* Make `nested_fields_for` works without a block (looking for partials)

Donation
--------
[![Paypal Donation](https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RK546KAJQ539U)

Copyleft
--------
Copyleft (c) 2011-2013 Lailson Bandeira (http://lailsonbandeira.com/). See LICENSE for details.
