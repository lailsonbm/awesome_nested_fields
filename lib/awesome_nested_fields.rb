require "rails" unless defined?(Rails)
require "action_view" unless defined?(ActionView)

module AwesomeNestedFields
  if ::Rails.version < '3.1'
    require 'awesome_nested_fields/railtie'
  else
    require 'awesome_nested_fields/engine'
  end
  
  require 'awesome_nested_fields/version'
  
  def self.escape_html_tags(html)
    html.gsub(/[&><]/) do |char|
      case char
      when '<' then '&lt;'
      when '>' then '&gt;'
      when '&' then '&amp;'
      end
    end.html_safe
  end
end

require 'rails/form_helper'