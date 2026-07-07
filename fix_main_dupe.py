with open('main.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for idx, line in enumerate(lines):
    if '// --- Dev Mode Deployment Tracker ---' in line:
        break
    new_lines.append(line)

with open('main.js', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
