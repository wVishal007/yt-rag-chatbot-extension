import os

# 📂 Folder to scan (current folder)
PROJECT_ROOT = "."

# 📄 Output file
OUTPUT_FILE = "combined_code.py"

# ❌ Files/Folders to ignore
IGNORE_FOLDERS = {
    "__pycache__",
    ".git",
    ".venv",
    "venv",
    "vector_db",
    ".idea",
    ".vscode"
}

IGNORE_FILES = {
    "merge_to_single.py",
    OUTPUT_FILE
}

def should_ignore(path):
    for folder in IGNORE_FOLDERS:
        if folder in path:
            return True
    return False


def merge_python_files():
    with open(OUTPUT_FILE, "w", encoding="utf-8") as outfile:
        outfile.write("# ===============================\n")
        outfile.write("# AUTO-GENERATED MERGED FILE\n")
        outfile.write("# ===============================\n\n")

        for root, dirs, files in os.walk(PROJECT_ROOT):
            if should_ignore(root):
                continue

            for file in files:
                if file.endswith(".py") and file not in IGNORE_FILES:
                    file_path = os.path.join(root, file)

                    print(f"Adding: {file_path}")

                    outfile.write("\n\n")
                    outfile.write("# =====================================\n")
                    outfile.write(f"# FILE: {file_path}\n")
                    outfile.write("# =====================================\n\n")

                    with open(file_path, "r", encoding="utf-8") as infile:
                        outfile.write(infile.read())

    print(f"\n✅ All useful Python files merged into: {OUTPUT_FILE}")


if __name__ == "__main__":
    merge_python_files()