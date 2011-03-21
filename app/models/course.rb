class Course < ActiveRecord::Base
  has_one :game
  has_many :course_holes, :dependent => :destroy
  accepts_nested_attributes_for :course_holes, :allow_destroy => true
  belongs_to :country
	belongs_to :state
	belongs_to :city
end
