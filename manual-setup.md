# Manual GitHub Setup (due to macOS Catalina + gh install issue)

1. Install gh manually:
   - Download from https://github.com/cli/cli/releases/latest (Darwin arm64/amd64 universal binary for macOS).
   - Or use MacPorts: `sudo port install gh`.
   - Verify: `gh version`.

2. `gh auth login --git-protocol https`

3. `gh repo create code-spartans-p2 --public --source=. --remote=origin --push --description \"CodeSpartans_P2 full-stack project\"`

Repo will be public at https://github.com/YOUR_USERNAME/code-spartans-p2

Alternative without gh:
1. Go to https://github.com/new
2. Repo name: code-spartans-p2 (public)
3. `git remote add origin https://github.com/YOUR_USERNAME/code-spartans-p2.git`
4. `git branch -M main`
5. `git push -u origin main`

Paste the repo URL once created.

