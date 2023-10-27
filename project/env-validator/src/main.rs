extern crate dotenv_parser;

mod test;

use std::{
    io::{self, Read},
    process::exit,
};

use dotenv_parser::parse_dotenv;

const ALLOWED_KEYS: [&'static str; 1] = ["PORT"];

enum ValidationResult {
    Ok,
    Err(String),
}

fn port(value: &str) -> ValidationResult {
    if let Ok(port) = value.parse::<u16>() {
        if port == 0 {
            ValidationResult::Err(format!("Invalid port number: {}", port))
        } else {
            ValidationResult::Ok
        }
    } else {
        ValidationResult::Err(format!("Invalid port: {}", value))
    }
}

fn validate(source: &str) -> Vec<String> {
    let parsed = parse_dotenv(&source);
    if let Err(err) = parsed {
        return vec![format!("Failed to parse: {}", err)];
    }
    let parsed = parsed.unwrap();

    let mut messages = Vec::new();

    for (key, _) in parsed.iter() {
        let mut allowed = false;
        for allowed_key in ALLOWED_KEYS.iter() {
            if allowed_key == key {
                allowed = true;
                break;
            }
        }
        if !allowed {
            messages.push(format!("Key '{}' is not allowed", key));
        }
    }

    macro_rules! validate {
        ($key:expr, $func:ident, $required:expr) => {
            if let Some(value) = parsed.get($key) {
                if let ValidationResult::Err(message) = $func(value) {
                    messages.push(message);
                }
            } else if ($required) {
                messages.push(format!("Key '{}' is required", $key))
            }
        };
    }

    validate!("PORT", port, true);

    messages
}

fn main() {
    let mut source = String::new();
    io::stdin()
        .read_to_string(&mut source)
        .expect("Failed to read from stdin");

    let messages = validate(&source);

    for message in messages.iter() {
        println!("{}", message);
    }
    if messages.len() != 0 {
        exit(1);
    }
}
