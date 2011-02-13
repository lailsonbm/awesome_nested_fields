class Person < ActiveRecord::Base
  has_many :phones
  accepts_nested_attributes_for :phones,
    :allow_destroy => true,
    :reject_if => lambda { |phone| phone['where'].blank? or phone['number'].blank?  }
end
