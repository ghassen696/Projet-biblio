import{u as r,a as i,r as n,j as o,B as u,T as e}from"./index-D1NhYGkL.js";function d(){const{role:t,logout:s}=r(),a=i();return n.useEffect(()=>{t!=="admin"&&(alert("You do not have permission to view this page, this page is only for admins"),a("/blog"))},[t,a]),o.jsxs(u,{children:[o.jsx(e,{variant:"h4",gutterBottom:!0,children:"Dashboard"}),t==="admin"&&o.jsx(e,{variant:"h5",children:"Welcome to Admin Dashboard"}),o.jsx("button",{onClick:s,children:"Logout"})]})}export{d as default};