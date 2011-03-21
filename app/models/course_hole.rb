class CourseHole < ActiveRecord::Base
  belongs_to :course
  has_one :score
end
