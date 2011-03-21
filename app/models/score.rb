class Score < ActiveRecord::Base
  belongs_to :user
  belongs_to :course_hole
end
