class GroupsController < ApplicationController
  # GET /groups
  # GET /groups.xml
  def index

	 @course = params[:course_id] if params[:course_id]
   @groups = Group.all
    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @groups }
    end
  end

  # GET /groups/1
  # GET /groups/1.xml
  def show
    @group = Group.find(params[:id])
    @users = User.find(:all)
    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @group }
    end
  end

  # GET /groups/new
  # GET /groups/new.xml
  def new
    
    @group = Group.new
    @users = User.find(:all)
    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @group }
    end
  end

  # GET /groups/1/edit
  def edit
    @group = Group.find(params[:id])
    @users = User.find(:all)
  end

  # POST /groups
  # POST /groups.xml
  def create
    @group = Group.new(params[:group])
    @group.user_id = self.current_user
		respond_to do |format|
      if @group.save
        format.html { redirect_to(groups_path, :notice => 'Group was successfully created.') }
        format.xml  { render :xml => @group, :status => :created, :location => @group }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @group.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /groups/1
  # PUT /groups/1.xml
  def update
    @group = Group.find(params[:id])

    respond_to do |format|
      if @group.update_attributes(params[:group])
        format.html { redirect_to(@group, :notice => 'Group was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @group.errors, :status => :unprocessable_entity }
      end
    end
  end

  def add_group_to_game
    @group = Group.find(params[:id])
    @game = Game.new
		@game.course_id= params[:course_id]
    @game.group_id = @group.id
    @game.user_id = self.current_user.id
		@game.status = 1
    @game.save
    @get_players = Group.find(@game.group_id).users
    @get_course  = Course.find(@game.course_id).course_holes
		@get_players.each do |gp|
      @get_course.each do |gc|
        @score = Score.find_by_game_id_and_course_hole_id_and_user_id(@game.id,gc.id,gp.id) || Score.new
        @score.user_id = gp.id
        @score.course_hole_id = gc.id
        @score.game_id = @game.id
        @score.score =  0
        @score.save
      end
    end
    #if @game.save
    redirect_to(new_score_path(:game_id => @game.id))
      # format.xml  { render :xml => @group, :status => :created, :location => @group }
     # else
     #   format.html { render :action => "new" }
       # format.xml  { render :xml => @group.errors, :status => :unprocessable_entity }
    #end

  end

  # DELETE /groups/1
  # DELETE /groups/1.xml
  def destroy
    @group = Group.find(params[:id])
    @group.destroy

    respond_to do |format|
      format.html { redirect_to(groups_url) }
      format.xml  { head :ok }
    end
  end
end
