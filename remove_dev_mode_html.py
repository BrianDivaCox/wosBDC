import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the Developer Settings section from index.html
target_start = '<div class="sidebar-section" style="margin-bottom:20px; background:var(--bg-main); padding:15px; border-radius:8px; border:1px solid var(--border);">'
target_start_idx = content.find(target_start)

if target_start_idx != -1:
    h3_str = '<h3 style="margin-top:0; margin-bottom:10px; font-size:16px; color:var(--text-main); border-bottom:1px solid var(--border); padding-bottom:5px;">Developer Settings</h3>'
    if content[target_start_idx:target_start_idx+500].find(h3_str) != -1:
        # We found the block! Find the end of it, which is before the next sidebar-section
        next_section = '<div class="sidebar-section" style="background:var(--bg-main); padding:15px; border-radius:8px; border:1px solid var(--border);">'
        next_section_idx = content.find(next_section, target_start_idx + len(target_start))
        if next_section_idx != -1:
            content = content[:target_start_idx] + content[next_section_idx:]
            with open('index.html', 'w', encoding='utf-8') as f:
                f.write(content)
            print("Successfully removed from index.html")
        else:
            print("Could not find next section")
    else:
        print("Could not find h3 Developer Settings")
else:
    print("Could not find target start")
