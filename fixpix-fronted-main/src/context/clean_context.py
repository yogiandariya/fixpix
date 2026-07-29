import re

with open('ImageContext.jsx', 'r') as f:
    content = f.read()

# Remove useHistory import
content = re.sub(r"import useHistory from '\.\./hooks/useHistory';\n", "", content)

# Remove defaultSettings
content = re.sub(r"const defaultSettings = \{.*?\};\n*", "", content, flags=re.DOTALL)

# Remove settings state line
content = re.sub(r"^\s*const \[settings, setSettings, undoSettings, redoSettings, canUndo, canRedo, historyLog, jumpToHistory, historyIndex\] = useHistory\(defaultSettings\);\n", "", content, flags=re.MULTILINE)

with open('ImageContext.jsx', 'w') as f:
    f.write(content)
