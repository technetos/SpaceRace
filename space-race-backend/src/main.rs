#![feature(async_await, await_macro, futures_api)]

use std::fs;
use tide::{http::StatusCode, Context, EndpointResult};

const MESH_PATH: &'static str = "../assets/meshes";

async fn meshes<T>(cx: Context<T>) -> EndpointResult<Vec<u8>> {
    let name: String = cx
        .param("name")
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let bytes = fs::read(format!("{}/{}", MESH_PATH, name)).map_err(|_| StatusCode::NOT_FOUND)?;

    Ok(bytes)
}

fn main() {
    let mut app = tide::App::new(());
    app.at("/meshes/:name").get(meshes);
    app.serve("127.0.0.1:8000").unwrap();
}
