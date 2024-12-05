
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useEffect } from "react";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
 // Link,
  useLoaderData,
  NavLink,
  useNavigation,
  useSubmit
} from "@remix-run/react";



import appStylesHref from "./app.css?url";
export const links:LinksFunction = ()=>[
  {rel:"stylesheet", href: appStylesHref}
  ];
/************************************************************************************************************************ */
import {getCharacters} from "./data";


const fetchCharacters = async (q?: string) => {
    const url = q
      ? `https://rickandmortyapi.com/api/character/?name=${q}`
      : `https://rickandmortyapi.com/api/character/`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results || []; 
  }
 
  export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q"); 
    const characters = await fetchCharacters(q); 
    return json({ characters, q })
  }
/********************************************************************************************************************* */
  export default function App() {
    const {characters, q}=useLoaderData<typeof loader>();
    const navigation =useNavigation();
    const submit=useSubmit();
    const searching=navigation.location && new URLSearchParams(navigation.location.search).has("q");

    useEffect(()=>{
      const searchField = document.getElementById("q");
      if(searchField instanceof HTMLInputElement){
        searchField.value=q || "";
      }    
    },[q])

    return (
<html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          
        <div>
        <Form id="search-form" role="search" onChange={(event) => {
               const isFirsSearch = null;
               submit(event.currentTarget, {replace:!isFirsSearch})
              }
               }>
              <input
                id="q"
                className={searching ? "loading" : ""}
                aria-label="Search characters"
                defaultValue={q || ""}
                placeholder="Search"
                type="search"
                name="q"
              />
              <div id="search-spinner" aria-hidden hidden={!searching} />
            </Form>
            
            </div>
            <nav>
            {characters.length ? (
      <ul>
        {characters.map((character) => (
          <li key={character.id}>
            <NavLink
            className={
              ({isActive,isPending})=>
               isActive ? "active" : isPending ? "pending" :"" 
             }
             to={`${character.image}`}
            >
              
              {character.name || <i>Sin Nombre</i> ?(
              <>
              {character.name}
              
              </>
              ):(<i>sin nombre</i>)
              }{" "}
              
           </NavLink>
          </li>
        ))}
      </ul>
            ):(
            <p>
              <i>No contacts</i>
              </p>
              )
          }
      </nav>
      
            </div>
            <div className={
          navigation.state==="loading" && !searching ? "loading" : ""
        } 
        id="detail">
          <Outlet/>
        
        </div>
        <ScrollRestoration />
        <Scripts />
        </body>
      </html>
    )
  }
