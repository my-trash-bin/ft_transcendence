use crate::validate;

#[test]
fn test1() {
    let source = r#"
        PORT=65536
    "#;
    let result = validate(&source);
    assert_eq!(result, vec!["Invalid port: 65536"]);
}
