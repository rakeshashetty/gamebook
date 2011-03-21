class CoursesController < ApplicationController
  # GET /courses
  # GET /courses.xml
  def index
    @courses = Course.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @courses }
    end
  end

  # GET /courses/1
  # GET /courses/1.xml
  def show
    @course = Course.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @course }
    end
  end

  # GET /courses/new
  # GET /courses/new.xml
  def new
		@i=1;
    @course = Course.new
    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @course }
    end
  end

  # GET /courses/1/edit
  def edit
		@i=1
    @course = Course.find(params[:id])
  end

	def add_holes
	  @i=10
		@course = params[:id]=='-1' ? Course.new : Course.find(params[:id])
		render :partial => 'add_more_course_details',:locals => {:f => @course}
	end

  # POST /courses
  # POST /courses.xml
  def create
    @course = Course.new(params[:course])
    @course.user_id = self.current_user
    respond_to do |format|
      if @course.save
        format.html { redirect_to(courses_path, :notice => 'Course was successfully created.') }
        format.xml  { render :xml => @course, :status => :created, :location => @course }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @course.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /courses/1
  # PUT /courses/1.xml
  def update
		@course = Course.find(params[:id])
		new_value = {:name => params[:course][:name],:par => params[:course][:par],:club => params[:course][:club],:holes => params[:course][:holes]}
		new_value.merge({:country_id => params[:course][:country_id] }) if params[:course][:country_id]
		new_value.merge({:state_id => params[:course][:state_id]}) if params[:course][:state_id]
		new_value.merge({:city_id => params[:course][:city_id]}) if params[:course][:city_id]
		
		@course.course_holes.each do |ch|
			ch.update_attributes(params[:course][:course_holes_attributes][ch.name.to_sym])
		end
    respond_to do |format|
      if @course.update_attributes(new_value)
        format.html { redirect_to(@course, :notice => 'Course was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @course.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /courses/1
  # DELETE /courses/1.xml
  def destroy
    @course = Course.find(params[:id])
    @course.destroy

    respond_to do |format|
      format.html { redirect_to(courses_url) }
      format.xml  { head :ok }
    end
  end
end
