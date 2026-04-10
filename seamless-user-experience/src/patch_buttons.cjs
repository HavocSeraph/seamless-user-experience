const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let changed = false;

    // Check if useToast is imported
    const hasUseToastImport = content.includes('useToast');
    let targetImport = 'import { useToast } from "@/hooks/use-toast";';
    if (!fs.existsSync(path.join(process.cwd(), 'hooks', 'use-toast.ts'))){
        targetImport = 'import { useToast } from "@/components/ui/use-toast";';
    }

    // Now replace buttons without onClick
    const buttonRegex = /<Button([^>]*)>/g;
    let match;
    let needsToast = false;
    
    const newContent = content.replace(buttonRegex, (match, attrs) => {
        if (!attrs.includes('onClick') && !attrs.includes('type') && !attrs.includes('asChild') && !attrs.includes('disabled')) {
            needsToast = true;
            return `<Button${attrs} onClick={(e) => { e.preventDefault(); toast({ title: 'Feature Unavailable', description: 'This action is currently in development before production launch.' }); }}>`;
        }
        return match;
    });

    if (needsToast) {
        if (!hasUseToastImport) {
            const lastImportIndex = Math.max(newContent.lastIndexOf('import '), 0);
            const endOfLastImport = newContent.indexOf('\n', lastImportIndex);
            
            // Insert import
            content = newContent.slice(0, endOfLastImport + 1) + targetImport + '\n' + newContent.slice(endOfLastImport + 1);
            
            // Insert hook definition
            const compRegex = /(?:export\s+default\s+function|export\s+const|const)\s+([A-Z][a-zA-Z0-9_]*)\s*(?:=\s*\([^)]*\)\s*=>\s*|\([^)]*\)\s*\{|\(\)\s*=>\s*\{|\(\)\s*\{)/;
            const compMatch = content.match(compRegex);
            if (compMatch) {
                // Find first opening brace after match.index
                const braceIndex = content.indexOf('{', compMatch.index);
                if (braceIndex !== -1) {
                    content = content.slice(0, braceIndex + 1) + '\n  const { toast } = useToast();' + content.slice(braceIndex + 1);
                }
            }
        } else {
            content = newContent;
            // check if const { toast } = useToast() exists
            if (!content.includes('const { toast } = useToast()')) {
                 const compRegex = /(?:export\s+default\s+function|export\s+const|const)\s+([A-Z][a-zA-Z0-9_]*)\s*(?:=\s*\([^)]*\)\s*=>\s*|\([^)]*\)\s*\{|\(\)\s*=>\s*\{|\(\)\s*\{)/;
                const compMatch = content.match(compRegex);
                if (compMatch) {
                    const braceIndex = content.indexOf('{', compMatch.index);
                    if (braceIndex !== -1) {
                        content = content.slice(0, braceIndex + 1) + '\n  const { toast } = useToast();' + content.slice(braceIndex + 1);
                    }
                }
            }
        }
    }

    if (originalContent !== content) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Patched:", filePath);
    }
}

function walk(dir) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.tsx') && !fullPath.includes('ui\\') && !fullPath.includes('ui/')) {
            processFile(fullPath);
        }
    });
}

walk(path.join(process.cwd(), 'pages'));
walk(path.join(process.cwd(), 'components'));
