class ScoresController < ApplicationController
  before_filter :get_game_details ,:only => [:new,:create,:edit,:update]
  # GET /scores
  # GET /scores.xml
  def index
   @games = Game.played_by_current_user(self.current_user)
    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @scores }
    end
  end

  # GET /scores/1
  # GET /scores/1.xml
  def show
    @score = Score.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @score }
    end
  end

  # GET /scores/new
  # GET /scores/new.xml
  def new
    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @score }
    end
  end

  # GET /scores/1/edit
  def edit
    @scores = Score.find_by_game_id(params[:game_id])
  end

  # POST /scores
  # POST /scores.xml
  def create
    @get_players.each do |gp|
      @get_course.each do |gc|
        @score = Score.find_by_game_id_and_course_hole_id_and_user_id(params[:game_id],gc.id,gp.id) || Score.new
        @score.user_id = gp.id
        @score.course_hole_id = gc.id
        @score.game_id = @selected_game.id
        @score.score = params[:score][gp.id.to_s.to_sym][gc.id.to_s.to_sym][0] ? params[:score][gp.id.to_s.to_sym][gc.id.to_s.to_sym][0] : 0
        @score.save
      end
    end
  
    redirect_to new_score_path(:game_id => @score.game_id)
    #@score = Score.new(params[:score])

   
  end

  # PUT /scores/1
  # PUT /scores/1.xml
  def update
    @score = Score.find(params[:id])

    respond_to do |format|
      if @score.update_attributes(params[:score])
        format.html { redirect_to(@score, :notice => 'Score was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @score.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /scores/1
  # DELETE /scores/1.xml
  def destroy
    @score = Score.find(params[:id])
    @score.destroy

    respond_to do |format|
      format.html { redirect_to(scores_url) }
      format.xml  { head :ok }
    end
  end

  def sync_records
    game = params[:game].split(',')
    score = params[:score].split(',')
    i=0
    while i < score.length-1 do
        @score = Score.find(score[i].to_i)
        i+=1
        @score.score = score[i]
        i+=1
        @score.updated_at = game[1]
        @score.save
    end
    @game=Game.find(game[0].to_i)
    @game.updated_at = game[1]
    @game.save
  end

  private

  def get_game_details
    @selected_game = Game.find(params[:game_id]);
    @score=Score.find(:all,:conditions =>["game_id = ?",params[:game_id]]);
    @get_players = Group.find(@selected_game.group_id).users
    @get_course  = Course.find(@selected_game.course_id).course_holes
  end

end
