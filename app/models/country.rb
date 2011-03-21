class Country < ActiveRecord::Base
  has_one :user
  has_many :states
	has_one :course
end
