import{r as o,a as f,j as e,B as b,T as c,M as d}from"./index-D1NhYGkL.js";import{T as r}from"./TextField-Dk-4ornD.js";import{L as j}from"./LoadingButton-BMu3H6Jc.js";import"./CircularProgress-CaBzOKsn.js";function v(){const[a,x]=o.useState({username:"",email:"",password:"",role:"user"}),[i,l]=o.useState(""),[m,y]=o.useState(""),h=f(),t=n=>{const{name:u,value:s}=n.target;x({...a,[u]:s})},g=async n=>{if(n.preventDefault(),!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(ucar|u-manouba|utm)\.tn$/.test(a.email)){l("Invalid email format. Must be something@something.(ucar|u-manouba|utm).tn");return}l("");const s=await fetch("http://localhost:5000/api/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});if(s.ok)h("/sign-in");else{const p=await s.text();alert(`Error registering user: ${p}`)}};return e.jsxs(b,{component:"form",onSubmit:g,display:"flex",flexDirection:"column",alignItems:"center",children:[e.jsx(c,{variant:"h5",sx:{mb:3},children:"Create an Account"}),e.jsx(r,{fullWidth:!0,name:"username",label:"Username",value:a.username,onChange:t,sx:{mb:3}}),e.jsx(r,{fullWidth:!0,name:"email",label:"Email",value:a.email,onChange:t,error:!!i,helperText:i,sx:{mb:3}}),e.jsx(r,{fullWidth:!0,name:"password",label:"Password",type:"password",value:a.password,onChange:t,sx:{mb:3}}),e.jsxs(r,{select:!0,fullWidth:!0,name:"role",label:"Role",value:a.role,onChange:t,sx:{mb:3},children:[e.jsx(d,{value:"user",children:"User"}),e.jsx(d,{value:"admin",children:"Admin"})]}),e.jsx(j,{fullWidth:!0,size:"large",type:"submit",color:"primary",variant:"contained",children:"Register"}),m&&e.jsx(c,{color:"success",sx:{mt:3},children:m})]})}function R(){return e.jsx(v,{})}export{R as default};