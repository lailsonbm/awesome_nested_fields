require 'bundler'
Bundler::GemHelper.install_tasks

# encoding: UTF-8

require 'rake/testtask'
require 'rdoc/task'

task :default => :test

desc 'Run AwesomeNestedFields unit tests.'
Rake::TestTask.new(:test) do |t|
  t.libs << 'lib'
  t.libs << 'test'
  t.pattern = 'test/*_test.rb'
  t.verbose = true
end

require "rspec/core/rake_task"
RSpec::Core::RakeTask.new(:spec) do |t|
  t.rspec_opts = '--backtrace --color'
end
