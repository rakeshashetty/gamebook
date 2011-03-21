/*Configuration of offline database*/
var db_name="Golf";
var db_version="1.0";
var display_name="Golf_database";
var db_size= 65535;
db = openDatabase(db_name,db_version,display_name,db_size);

/*Functionality is to configure offline database*/
function offline_storage(){
    db.transaction(
        function(tx) {
//                        tx.executeSql('DROP TABLE LOGIN ;');
//                        tx.executeSql('DROP TABLE GAMES ;');
//                        tx.executeSql('DROP TABLE SCORE ;');
            tx.executeSql('CREATE TABLE IF NOT EXISTS LOGIN ' +
                          '(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
			  ' name TEXT NOT NULL UNIQUE);'
                 );
            tx.executeSql('CREATE TABLE IF NOT EXISTS SCORE ' +
                          '(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
                          ' score_id INTEGER UNIQUE,game_id INTEGER,user_id INTEGER,par INTEGER,score INTEGER, ' +
                          ' course_hole_id INTEGER,user_name TEXT, ' +
                          ' created_at TIMESTAMP,updated_at TIMESTAMP); '
                );
            tx.executeSql('CREATE TABLE IF NOT EXISTS GAMES ' +
                '(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,user_name TEXT,group_name TEXT,course_name TEXT,no_of_holes INTEGER,' +
                ' course_id INTEGER,user_id INTEGER,group_id INTEGER,game_id INTEGER,status INTEGER, created_at TIMESTAMP,updated_at TIMESTAMP); '
                );
        });
}

/* function to validate login information */
function validate_login(){
    if(isOnline()){
        if(isEmpty($('#login'))) return;
        else if(isEmpty($('#password'))) return;
        else  $("form").submit();
    }
    else{offline_message();}
}

/*Functionality is to throw error message during offline database transaction*/
function errorHandler(m, error) {
    alert('Oops. Error was '+error.message+' (Code '+error.code+')');
    return true;
}

/*message to be displayed when the browser goees offline*/
function offline_message(){
    alert("Sorry !!! In Aeroplane mode");
}

/*Functionality is to store login information in offline storage*/
function store_login_offline(login){
    db.transaction(
        function(tx) {
            tx.executeSql('INSERT INTO LOGIN(name) VALUES(?);',
                [login]
            );
        });
}

/*Functionality is to logout user and clear login information offline*/
function logout_session(){
    db.transaction(
        function(tx) {
            tx.executeSql('DELETE FROM LOGIN;'
                );
        });
    if(isOnline()) redirect_to_path('/logout');
    else  redirect_to_path('/');
}

/* function to check score save */
function check_score_save(game_id){
    if(!isOnline()){
        db.transaction(
            function(tx){
                tx.executeSql('SELECT user_id,score_id,course_hole_id FROM SCORE WHERE game_id =?;',
                    [game_id]
                    ,function(tx,results){
                        for(i=0;i<=results.rows.length-1;i++){
                            row = results.rows.item(i).user_id;
                            holes= results.rows.item(i).course_hole_id;
                            tx.executeSql('UPDATE SCORE SET score =? WHERE score_id =?;',
                                [$('#score_'+row+'_'+holes+'_').val(),results.rows.item(i).score_id]
                                );
                        }
                        tx.executeSql('UPDATE Games SET updated_at = ? WHERE game_id =?;',
                            [getUTCformatDate(new Date()),game_id]
                            );
                        alert("Record Saved !!!");
                    }
                    );
            });
    }
    else{
        $("form").submit();
    }
}

/* function to show score screen */
function show_score_screen(){
    if(isOnline()){
                   db.transaction(
        function(tx){
            tx.executeSql('SELECT * FROM SCORE WHERE user_name IN (SELECT name FROM LOGIN ) ;',[],
            function(tx,results){
                if(results.rows.length==0){
                    offline_message();
                }
                else{
                        for(i=0;i<=results.rows.length;i++){
                                //alert(results.rows.items(i).game_name);
                            }
                    }
            }
            );
        });
    }
    else{
            redirect_to_path('/group/new');
        }
}

/*function to sync server and offline */
function syncGame(){

 callAjax('syncGame')

}

/*Function for play golf in offline */
function join_a_game(){
    if(isOnline()) redirect_to_path('/scores');
    else{
         db.transaction(
        function(tx){
            tx.executeSql('SELECT * FROM LOGIN;',[],
            function(tx,results){
                if(results.rows.length==0) alert('Not an authorized user');
                else redirect_to_path('/game_screen.html');
            }
           );
        });
   }
}

/*function check network status message as online or offline*/
function check_network_status(){
    if(isOnline()){
        status="O";
        color="green";
    }
    else{
        status="!";
        color="red";
    }
    display_network_status(status,color);
}

/*function that displays the network status message*/
function display_network_status(status,color){
    $('#online_status').replaceWith('<a id="online_status" class="button" style="color:'+color+'">'+status+'</a>');
}

/*function to display register page*/
function register_screen(){
    if(isOnline()) redirect_to_path('/signup');
    else offline_message();
}

/*function to display new score page*/
function new_score_show(game_id,updated_at){
    if(isOnline()){
        
        db.transaction(
            function(tx){
                
                tx.executeSql('SELECT updated_at FROM games where game_id=? and updated_at > ?;',[game_id,updated_at],
                    function(tx,results){
                        if(results.rows.length == 0 ) redirect_to_path("/scores/new?game_id="+game_id);
                        else{
                             var check_sync = confirm("ALERT !!! Data Mismatch. Press OK to update your score")
                             if(check_sync){
                                var game =new Array()
                                game[0]= game_id
                                game[1]= results.rows.item(0).updated_at
                                tx.executeSql('SELECT * FROM score where game_id=?;',[game_id],
                                    function(tx,results){
                                         score = new Array(results.rows.length);
                                        for(i=0;i<score.length;i++){
                                             score[i] = new Array(2);
                                         }
                                        for(i=0;i<results.rows.length;i++){
                                            score[i][0] = results.rows.item(i).score_id
                                            score[i][1] = results.rows.item(i).score
                                           // score={'id':results.rows.item(i).score_id,'score':results.rows.item(i).score,'game_id':results.rows.item(i).game_id}
                                            //game={id:1}
                                          
                                        }
                                        callAjax({url:'/scores/'+game_id+'/sync_records',params:'game='+game+'&score='+score,method:'GET',contentType:'application/json',callbackfunction:'scorescreen('+game_id+')'});
                                }
                                );
                              }else{
                                  redirect_to_path("/scores/new?game_id="+game_id);
                              }
                               
                        }
                    }
                    );
            });
    }
    else {
        setup_scores_screen(game_id);
    }
}

/*function to redirect to score screen after sync*/
function scorescreen(game_id){
   redirect_to_path("/scores/new?game_id="+game_id);
}

/*function to set local storage*/
function setStorage(key,value) {
    localStorage.setItem(key,value);
}

/*function to get local storage*/
function getStorage(key) {
   return localStorage.getItem(key);
}

/*function to setup score screen during offline*/
function setup_scores_screen(game_id){
    setStorage('currentGameId',game_id);
    redirect_to_path('/game_score.html');
}

function check_back_button(path){
    if(isOnline()) redirect_to_path(path);
    else redirect_to_path('/');
}