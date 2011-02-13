Awesome Nested Fields
=====================

In Rails, you can create forms that have fields from nested models. For example, if a person has many phone numbers, you can easily create a form that receives data from the person and from a fixed number of phones. However, when you want to allow the person to insert multiple, indefinite phones, you're in trouble: it's [much harder](http://railscasts.com/episodes/196-nested-model-form-part-1) [than it](http://railscasts.com/episodes/197-nested-model-form-part-2) [should be](http://stackoverflow.com/questions/1704142/unobtrusive-dynamic-form-fields-in-rails-with-jquery). Well, not anymore.


Installation
------------

1. Add the gem to your Gemfile.

        gem 'awesome_nested_fields'

2. Run bundler to make sure the gem gets installed.

        bundle install
    
3. Include the `jquery.nested-fields.js` file in your template (or in the pages that will use nested fields).
    
        <script src="/javascripts/jquery.nested-fields.js" type="text/javascript"></script>

Now you're ready to rock with nested models. Don't forget to include the javascript file _after_ you've included jQuery. And don't worry because this file isn't on the public folder: it comes bundled into the gem.


Compatibility
-------------

awesome_nested_fields works only with Rails 3 and was tested with jQuery 1.5.0.



