#![feature(async_await, await_macro, futures_api)]

use std::fs;
use tide::{
    http::{response::Builder as ResponseBuilder, StatusCode},
    Context, EndpointResult,
};

const INDEX_PATH: &'static str = "..";
const MESH_PATH: &'static str = "../assets/meshes";
const SCRIPT_PATH: &'static str = "../assets/scripts";
const TEXTURE_PATH: &'static str = "../assets/textures";
const SOUND_PATH: &'static str = "../assets/sounds";

// Serve the main page
async fn page<T>(_cx: Context<T>) -> EndpointResult {
    let bytes =
        fs::read(format!("{}/{}", INDEX_PATH, "index.html")).map_err(|_| StatusCode::NOT_FOUND)?;

    
    println!("GET {}/index.html", INDEX_PATH);
    Ok(ResponseBuilder::new()
        .header("Content-Type", "text/html")
        .status(StatusCode::OK)
        .body(bytes.into())
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .into())
}

// Serve script assets
async fn scripts<T>(cx: Context<T>) -> EndpointResult {
    let name: String = cx
        .param("name")
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let bytes = fs::read(format!("{}/{}", SCRIPT_PATH, name)).map_err(|_| StatusCode::NOT_FOUND)?;

    println!("GET {}/{}", SCRIPT_PATH, &name);
    Ok(ResponseBuilder::new()
        .header("Content-Type", "application/javascript")
        .status(StatusCode::OK)
        .body(bytes.into())
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .into())
}

// Serve mesh assets
async fn meshes<T>(cx: Context<T>) -> EndpointResult<Vec<u8>> {
    let name: String = cx
        .param("name")
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let bytes = fs::read(format!("{}/{}", MESH_PATH, name)).map_err(|_| StatusCode::NOT_FOUND)?;

    println!("GET {}/{}", MESH_PATH, &name);
    Ok(bytes)
}

// Serve texture assets
async fn textures<T>(cx: Context<T>) -> EndpointResult<Vec<u8>> {
    let name: String = cx
        .param("name")
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let bytes = fs::read(format!("{}/{}", TEXTURE_PATH, name)).map_err(|_| StatusCode::NOT_FOUND)?;

    println!("GET {}/{}", TEXTURE_PATH, &name);
    Ok(bytes)
}

// Serve sound assets
async fn sounds<T>(cx: Context<T>) -> EndpointResult<Vec<u8>> {
    let name: String = cx
        .param("name")
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let bytes = fs::read(format!("{}/{}", SOUND_PATH, name)).map_err(|_| StatusCode::NOT_FOUND)?;

    println!("GET {}/{}", SOUND_PATH, &name);
    Ok(bytes)
}

fn main() {
    let mut app = tide::App::new(());
    app.at("/").get(page);
    app.at("/scripts/:name").get(scripts);
    app.at("/meshes/:name").get(meshes);
    app.at("/textures/:name").get(textures);
    app.at("/sounds/:name").get(sounds);
    app.serve("127.0.0.1:8000").unwrap();
}
