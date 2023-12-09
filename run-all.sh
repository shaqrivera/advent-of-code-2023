for dir in */; do
    if [[ "$dir" != *"node_modules"* ]]; then
        (cd "$dir" && npm start)
    fi
done