awesome_nested_fields
=====================

In Rails, you can create forms that have fields from nested models. For example, if a person has many phone numbers, you can easily create a form that receives data from the person and from a fixed number of phones. However, when you want to allow the person to insert multiple, indefinite phones, you're in trouble: it's much harder than it should be. Well, not anymore.


Installation
------------

1. Add this line to your Gemfile:

        gem 'awesome_nested_fields'
    
2. Include the `jquery.nested-fields.js` file to your template (or to the pages that will use nested fields):
    
        <script src="/javascripts/jquery.nested-fields.js" type="text/javascript"></script>

3. Now you're ready to rock with nested models.
    
Don't forget to include the file _after_ you've included jQuery. And don't worry because this file isn't on the public folder: it comes bundled into the gem.


Compatibility
-------------

awesome_nested_fields works only with Rails 3 and was tested with jQuery 1.5.



