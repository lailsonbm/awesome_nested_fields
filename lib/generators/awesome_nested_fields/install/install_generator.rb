require 'rails'

module AwesomeNestedFields
  module Generators
    class InstallGenerator < ::Rails::Generators::Base
      desc 'This generator installs Awesome Nested Fields'
      source_root File.expand_path('../../../../../vendor/assets/javascripts', __FILE__)
      
      def copy_js
        say_status('copying', 'awesome nested fields js file', :green)
        copy_file 'jquery.nested-fields.js', 'public/javascripts/jquery.nested-fields.js'
      end
    end
  end
end if ::Rails.version < '3.1'