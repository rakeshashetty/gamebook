class City < ActiveRecord::Base
  belongs_to :state
	has_one :course
end
