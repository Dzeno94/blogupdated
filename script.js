var users = [{
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    address: 'Grbavicka br12',
    username: 'johny',
    password: '123456',
}];

var loggedUser = {};


var allBlogs = [];

var signupForm = document.getElementById('signup-form');
signupForm.style.display = 'none';


function isUserLogged() {
    var userData = localStorage.getItem('loggedUser');
    if (userData) {
        var user = JSON.parse(userData);
        login(user.email, user.password);
    }
    
}

isUserLogged();
displayBlog(allBlogs);
displayPage();

function login(p_email, p_password) {
    var email = p_email || document.getElementById('email').value;
    var password = p_password || document.getElementById('password').value;
    var usersData = localStorage.getItem('users');
    if (usersData) {
        users = JSON.parse(usersData);
    }
    for (var user of users) {
        if ((email === user.email || email === user.username) && password === user.password) {
            var loginForm = document.getElementById('login-form');
            loginForm.style.display = 'none';
            var nav = document.querySelector('.nav');
            nav.style.display = 'block';
            var name = document.getElementById('user-name');
            name.innerHTML = user.name;
            loggedUser = user;
            localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
            clearValue('email');
            clearValue('password');
        } else {
            var errorMsg = document.querySelector('#login-form .error-msg');
            errorMsg.style.display = 'block';
        }
    }
    var blogArea= document.getElementsByClassName("blog-area");
    blogArea[0].style.display = 'block';
    displayBlog();
    showBlogArea();
    
   
   
}

function loginOnEnter(e,blogs) {
    if (e.keyCode === 13) {
        console.log('User je pritisnuo enter');
        login();
    }
    hideNavig()
    
    
}

function logout() {
   
    var loginForm = document.getElementById('login-form');
    loginForm.style.display = 'block';
    var nav = document.querySelector('.nav');
    nav.style.display = 'none';
    document.querySelector('#login-form .error-msg').style.display = 'none';
    localStorage.removeItem('loggedUser');
    loggedUser={};
    displayNavig();
    displayOnLogout();
   
   

    
}


function goToSignupForm() {
    var loginForm = document.getElementById('login-form');
    var blogArea = document.querySelector('.blog-area');
    blogArea.style.display = 'none';
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    displayNavig();
}

function goToLoginForm() {
    var loginForm = document.getElementById('login-form');
    var blogArea = document.querySelector('.blog-area');
    blogArea.style.display = 'none';
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    displayNavig();
    
}

function registerNow() {
    console.log('logika za dodavanje korisnika');
    var name = getValue('name');
    var email = getValue('su-email');
    var address = getValue('address');
    var username = getValue('username');
    var password = getValue('su-password');
    if (name === '' || email === '' || address === '' || username === '' || password === '') {
        return alert('Unesite sve podatke')
    }
    var user = {
        name,
        email,
        address,
        username,
        password
    };
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users))
    clearValue('name');
    clearValue('su-email');
    clearValue('address');
    clearValue('username');
    clearValue('su-password');

    goToLoginForm();
}

function getValue(id) {
    return document.getElementById(id).value;
}

function clearValue(id) {
    document.getElementById(id).value = '';
}

function postBLog() {
    var blogTitle = getValue('blog-title');
    var blogDesc = getValue('blog-desc');

    if (blogTitle === '' || blogDesc === '') {
        return alert('Popunite sve podatke')
    }

    var blog = {
        blogTitle,
        blogDesc,
        postDate: new Date(),
        author: loggedUser.name,
        comments:[],
        

    };

    allBlogs.push(blog);
    localStorage.setItem('blogs', JSON.stringify(allBlogs));
    displayBlog();
    
    clearValue('blog-title');
    clearValue('blog-desc');

    var loginSignup=document.querySelector(".login-signup")
        loginSignup.style.display="none";
        var blogInput=document.querySelector(".blog-input-container");
        blogInput.style.display="none";
        var blogAppearBtn=document.createElement("button");
        blogAppearBtn.innerHTML="Add new blog";
        blogAppearBtn.classList.add("blog-appear-btn");
        
        blogAppearBtn.addEventListener("click",function(){
            var blogInput=document.querySelector(".blog-input-container");
        blogInput.style.display="block";
        blogAppearBtn.style.display="none";
       

        })

        blogInput.parentNode.insertBefore(blogAppearBtn,blogInput)
    
}

function displayBlog() {
    console.log("display")
    var blogsData = localStorage.getItem('blogs');
    if (blogsData) {
        allBlogs = JSON.parse(blogsData);
    }
    renderBlogs(allBlogs);
   
   
}

function searchBlogs(e) {
    var searchBy = e.target.value;
    var filteredBlogs = [];
    for (var blog of allBlogs) {
        if (blog.blogTitle.toLowerCase().indexOf(searchBy.toLowerCase()) > -1) {
            filteredBlogs.push(blog);
        }
    }
    renderBlogs(filteredBlogs);
}

function renderBlogs(blogs) {
    blogs.sort((a,b)=>new Date(b.postDate)-new Date(a.postDate));
    var publishedBlogs = document.getElementById('published-blogs')
    publishedBlogs.innerHTML = '';
    for (var blog of blogs) {
        var h3 = document.createElement('h3');
        h3.innerHTML = blog.blogTitle;
        h3.classList.add('blog-title');
        var div = document.createElement('div');
        div.classList.add('posted-blog');
        var p = document.createElement('p');
        p.innerHTML = blog.blogDesc;
        var span = document.createElement('span');
        span.innerHTML = `Author: ${blog.author}`;
        var datum = document.createElement('i');
        datum.style.paddingLeft = '30px';
        datum.innerHTML = new Date(blog.postDate).toLocaleString();
        var btn =document.createElement('button');
        btn.innerText='Izbriši';
    //    btn.addEventListener("click",function(){
    //        deleteBlog(blog);
    //    })
        div.appendChild(p);
        div.appendChild(span);
        div.appendChild(datum);
        publishedBlogs.appendChild(h3);
        deleteBlog(blog);
        publishedBlogs.appendChild(div);
       showComments(blog.comments);
        publishedBlogs.appendChild(addComment(blog));

    }
    
} function addComment(blog){
    
    var input=document.createElement('input');
    input.classList.add('blog-input');
    input.placeholder='Leave a comment....';
    input.style='width:50%;margin-left:50%;margin-top:5px'
    input.addEventListener('keyup',function(e){
        var text =e.target.value;
        if(e.keyCode!=13)return;
        console.log("logged user", loggedUser);
       if(!loggedUser.name){
      return goToSignupForm()
        }
       
        var comment ={
            text,
            author:loggedUser.name,
            postedDate:new Date()
        }
        if(!blog.comments){
            blog.comments=[];
    
        }
        blog.comments.push(comment);
        localStorage.setItem('blogs',JSON.stringify(allBlogs))
        input.value='';
        
        
 renderBlogs(allBlogs);
            
            
        
        
    })
    return input;
}
function showComments(comments,parentEl){
    var publishedBlogs = document.getElementById('published-blogs');
    for (var comment of comments) {

var div = document.createElement('div');
div.style='width:60%;margin-left:40%;padding=7px;margin-top:5px;'
 div.classList.add('posted-blog');
        var p = document.createElement('p');
        p.innerHTML = comment.text;
        p.style='margin-bottom:5px;padding:3px'
        var span = document.createElement('span');
        span.innerHTML = `Author: ${comment.author}`;
        var datum = document.createElement('i');
        datum.style.paddingLeft = '30px';
        datum.innerHTML = new Date(comment.postedDate).toLocaleString();
        div.appendChild(p);
        div.appendChild(span);
        div.appendChild(datum);
        publishedBlogs.appendChild(div);
    }
    
}
function deleteBlog(blog){
    var publishedBlogs = document.getElementById('published-blogs');

    var btn =document.createElement('button');
    btn.innerText='X';
    btn.classList.add('delete')
    if(loggedUser.name!=blog.author){btn.style='display:none'}
    
    
    btn.addEventListener('click',function(e){
        var response =confirm('Jeste li sigurni?')
        if(loggedUser.name==blog.author){
        
        if(!response)return;
            for(var i=0;i<allBlogs.length;i++){
                allBlogs.splice(i,1);
                
                localStorage.setItem('blogs',JSON.stringify(allBlogs));
                renderBlogs(allBlogs);
                
            }
            

            
        }else{
            alert('Vi nise autor ovog bloga!!')
        }
    })
    publishedBlogs.appendChild(btn);
    return btn;
}
function displayPage(){
    
    if(!loggedUser.name){
        var blogInput=document.querySelector(".blog-input-container");
        blogInput.style.display="none";
//var blogTitle = document.getElementById("blog-title");
   // var blogDesc = document.getElementById('blog-desc');
   // var blogBtn=document.getElementsByClassName("blog-post-btn");
    var loginForm=document.getElementById("login-form");
  //  blogBtn[0].style.display="none";
  //  blogTitle.style.display="none";
    //blogDesc.style.display="none";
    loginForm.style.display="none";
   
    displayNavig();  
    
       
    }else{

    }
   
    
        
    
}


function displayNavig(){
    var navig = document.getElementById("navig");
    
        navig.style.display="block";
        return navig;
  
    }
   function  hideNavig(){
    var navig = document.getElementById("navig");
    
    navig.style.display="none";
   }
   function showBlogArea(){
    var loginSignup=document.querySelector(".login-signup")
    loginSignup.style.display="none";
    var blogInput=document.querySelector(".blog-input-container");
    blogInput.style.display="none";
    var blogAppearBtn=document.createElement("button");
    blogAppearBtn.innerHTML="Add new blog";
    blogAppearBtn.classList.add("blog-appear-btn");
   
    
    blogAppearBtn.addEventListener("click",function(){
        let blogInput=document.querySelector(".blog-input-container");
        console.log("add blog click",blogInput);
    blogInput.style.display="block";
    this.style.display="none";
   

    })

    blogInput.parentNode.insertBefore(blogAppearBtn,blogInput)
   }

   function displayOnLogout(){
    
    var blogInput=document.querySelector(".blog-input-container");
    blogInput.style.display="none";
    var blogAppearBtn=document.querySelector(".blog-appear-btn");
    blogAppearBtn.style.display="none";
    var loginSignup=document.querySelector(".login-signup")
    loginSignup.style.display="block";
    var loginForm = document.getElementById('login-form');
    loginForm.style.display="none";
   
    
    
   

 

    
   }




