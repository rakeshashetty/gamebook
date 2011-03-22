class Score < ActiveRecord::Base
  belongs_to :user
  belongs_to :course_hole

 def self.update_changed_score(game_id,course_hole_id,player_id,score_val)
   scoreobj = self.find_by_game_id_and_course_hole_id_and_user_id(game_id,course_hole_id,player_id)
   scoreobj.score = score_val
   scoreobj.save
   return scoreobj.updated_at
 end
end
