module ScoresHelper
  def get_score(game,course,player)
     return Score.find_by_user_id_and_course_hole_id_and_game_id(player,course,game) ? Score.find_by_user_id_and_course_hole_id_and_game_id(player,course,game).score : 0
  end
end
