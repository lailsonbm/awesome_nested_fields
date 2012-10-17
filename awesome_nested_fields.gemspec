# encoding: utf-8
require File.expand_path('../lib/awesome_nested_fields/version', __FILE__)

Gem::Specification.new do |s|
  s.name        = 'awesome_nested_fields'
  s.version     = AwesomeNestedFields::VERSION
  s.platform    = Gem::Platform::RUBY
  s.authors     = %q[Lailson Bandeira]
  s.email       = %q[lailson@guava.com.br]
  s.homepage    = 'http://rubygems.org/gems/awesome_nested_fields'
  s.summary     = 'Awesome nested fields for Rails'
  s.description = 'Awesome dynamic nested fields for Rails and jQuery'

  s.required_rubygems_version = ">= 1.3.6"
  s.rubyforge_project         = "awesome_nested_fields"

  s.add_development_dependency 'bundler', '>= 1.0.0'
  s.add_development_dependency 'rspec', '>=2'
  s.add_development_dependency 'turn', '~> 0.8.3' 
  s.add_runtime_dependency 'rails', '>= 3.0.0'

  s.files        = `git ls-files`.split("\n")
  s.executables  = `git ls-files`.split("\n").map{|f| f =~ /^bin\/(.*)/ ? $1 : nil}.compact
  s.require_path = 'lib'
end
