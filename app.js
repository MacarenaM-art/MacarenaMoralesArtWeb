const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const slug=t=>String(t).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const load=async f=>(await fetch("data/"+f+".json")).json();
const img=(src,alt)=>src?`<img src="${esc(src)}" alt="${esc(alt)}">`:`<div class="ph"></div>`;
const page=document.body.dataset.page;
const sec=["escuela","horarios","exposicion","solidaridad"];
const on=(p)=>page===p?' class="on"':"";
const subs=[["escuela","Sobre la escuela"],["horarios","Horarios"],["exposicion","Exposición alumnos"],["solidaridad","Solidaridad"]];
document.body.insertAdjacentHTML("afterbegin",`<header><a class="logo" href="index.html">MACARENA MORALES ART</a>
<nav><a href="index.html"${on("galeria")||on("obra")}>Galería</a><span class="sep">|</span><a href="#" id="esc"${sec.includes(page)?' class="on"':""}>Escuela</a><span class="sep">|</span><a href="sobre-mi.html"${on("sobremi")}>Sobre mí</a><span class="sep">|</span><a href="contacto.html"${on("contacto")}>Contacto</a>
<div class="sub${sec.includes(page)?" open":""}" id="sub">${subs.map(([p,t])=>`<a href="${p}.html"${on(p)}>${t}</a>`).join("")}</div></nav></header><main id="m"></main>`);
document.getElementById("esc").onclick=e=>{e.preventDefault();document.getElementById("sub").classList.toggle("open")};
const q=new URLSearchParams(location.search).get("o");
const M=document.getElementById("m");
const grid=(arr,href)=>`<div class="grid">${arr.map(o=>`<a class="card" href="${href}?o=${slug(o.titulo)}">${img(o.imagen,o.titulo)}<span>${esc(o.titulo)}</span></a>`).join("")}</div>`;
(async()=>{
if(page==="galeria"){const d=await load("obras");M.innerHTML=grid(d.obras,"obra.html")}
if(page==="obra"){const d=await load("obras");const o=d.obras.find(x=>slug(x.titulo)===q)||d.obras[0];
M.innerHTML=`<div class="split"><div>${img(o.imagen,o.titulo)}</div><div><h1>${esc(o.titulo)}</h1><p class="meta">${esc(o.medidas)}</p><p class="txt">${esc(o.descripcion)}</p></div></div>`}
if(page==="escuela"){const t=await load("textos");
M.innerHTML=`<div class="split"><div>${img(t.escuela_foto,"La escuela")}</div><div><h1>La escuela</h1><p class="txt">${esc(t.escuela_texto)}</p></div></div>`}
if(page==="horarios"){const d=await load("horarios");const D=["lunes","martes","miercoles","jueves","viernes","sabado"];
const cel=v=>{if(!v)return"<td></td>";const[a,...b]=v.split("\n");return`<td><b>${esc(a)}</b><small>${esc(b.join(" "))}</small></td>`};
const rows=d.franjas.map((f,i,a)=>{const first=i===0||a[i-1].periodo!==f.periodo;const n=a.filter(x=>x.periodo===f.periodo).length;
return`<tr>${first?`<th class="p" rowspan="${n}">${esc(f.periodo.toUpperCase())}</th>`:""}${D.map(x=>cel(f[x])).join("")}</tr>`}).join("");
M.innerHTML=`<div class="tw"><table><tr><th></th>${["LUNES","MARTES","MIÉRCOLES","JUEVES","VIERNES","SÁBADO"].map(x=>`<th>${x}</th>`).join("")}</tr>${rows}</table></div>`}
if(page==="exposicion"){const d=await load("exposicion");const o=q&&d.obras.find(x=>slug(x.titulo)===q);
const cab=`<h1>${esc(d.titulo)}</h1><p class="beneficio">${esc(d.beneficio)}</p>`;
M.innerHTML=o?`<div class="split"><div>${img(o.imagen,o.titulo)}</div><div>${cab}<h1 style="color:#000">${esc(o.titulo)}</h1><p class="alumno">${esc(o.alumno)}</p><p class="meta">${esc(o.medidas)}</p></div></div>`:cab+grid(d.obras,"exposicion.html")}
if(page==="solidaridad"){const d=await load("solidaridad");
M.innerHTML=`<p style="font-size:1.3rem">${esc(d.intro)}</p><p class="total">${esc(d.total)}</p>${d.items.map(i=>`<p>${esc(i.texto)}</p>`).join("")}`}
if(page==="sobremi"){const t=await load("textos");
M.innerHTML=`<div class="split"><div>${img(t.sobre_mi_foto,"Macarena Morales")}</div><div><h1>Macarena Morales</h1><p class="txt">${esc(t.sobre_mi_texto)}</p></div></div>`}
if(page==="contacto"){const t=await load("textos");
M.innerHTML=`<h1>Contacto Macarena</h1><p class="txt">${esc(t.contacto_macarena)}</p><h1 style="margin-top:2em">Contacto Escuela</h1><p class="txt">${esc(t.contacto_escuela)}</p>`}
})();
