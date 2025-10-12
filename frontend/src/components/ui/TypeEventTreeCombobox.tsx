import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type TypeEventNode = {
  id: number;
  title: string;
  en_title?: string;
  ar_title?: string;
  icon_path?: string | null;
  coding?: string | null;
  children?: TypeEventNode[];
};

type SingleChange = (val: number, node?: TypeEventNode) => void;
type MultiChange = (val: number[], nodes?: TypeEventNode[]) => void;

export type TypeEventTreeComboboxProps = {
  value?: number | number[];
  onChange?: SingleChange | MultiChange;
  multiple?: boolean;
  placeholder?: string;
  data: TypeEventNode[]; // ✅ فقط از این استفاده می‌کنیم
  className?: string;
  disabled?: boolean;
  dir?: "rtl" | "ltr" | "auto";
};

function findPath(nodes: TypeEventNode[], target: number): TypeEventNode[] | null {
  const stack: { node: TypeEventNode; path: TypeEventNode[] }[] = [];
  for (const n of nodes) stack.push({ node: n, path: [n] });
  while (stack.length) {
    const { node, path } = stack.pop()!;
    if (node.id === target) return path;
    if (node.children?.length) {
      for (const c of node.children) stack.push({ node: c, path: [...path, c] });
    }
  }
  return null;
}

function collectNodesByIds(tree: TypeEventNode[], ids: number[]): TypeEventNode[] {
  const map = new Map<number, TypeEventNode>();
  const stack = [...tree];
  while (stack.length) {
    const n = stack.pop()!;
    map.set(n.id, n);
    if (n.children?.length) stack.push(...n.children);
  }
  return ids.map(id => map.get(id)).filter(Boolean) as TypeEventNode[];
}

export default function TypeEventTreeCombobox({
  value,
  onChange,
  multiple = false,
  placeholder = "یک نوع حادثه را انتخاب کنید…",
  data,
  className,
  disabled,
  dir = "rtl",
}: TypeEventTreeComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState<Set<number>>(new Set());
  const [search, setSearch] = React.useState("");
  const [internalValue, setInternalValue] = React.useState<number | number[] | undefined>(value);

  React.useEffect(() => {
    if (typeof value !== "undefined") setInternalValue(value);
  }, [value]);

  const isSelected = (id: number) => {
    if (multiple) return Array.isArray(internalValue) && internalValue.includes(id);
    return internalValue === id;
  };

  const setValueAndEmit = (ids: number | number[]) => {
    setInternalValue(ids);
    if (!onChange) return;
    if (multiple) {
      const arr = Array.isArray(ids) ? ids : [ids];
      const nodes = collectNodesByIds(data, arr);
      (onChange as MultiChange)(arr, nodes);
    } else {
      const id = Array.isArray(ids) ? ids[0] : ids;
      const nodes = collectNodesByIds(data, [id]);
      (onChange as SingleChange)(id, nodes[0]);
    }
  };

  const toggleSelect = (id: number) => {
    if (multiple) {
      const arr = Array.isArray(internalValue) ? [...internalValue] : [];
      const idx = arr.indexOf(id);
      if (idx === -1) arr.push(id);
      else arr.splice(idx, 1);
      setValueAndEmit(arr);
    } else {
      setValueAndEmit(id);
      setOpen(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filterNodes = React.useCallback((nodes: TypeEventNode[], q: string): TypeEventNode[] => {
    if (!q.trim()) return nodes;
    const matches: TypeEventNode[] = [];
    const query = q.toLowerCase();

    const dfs = (n: TypeEventNode): TypeEventNode | null => {
      const selfMatch = n.title.toLowerCase().includes(query);
      const childMatches = (n.children || [])
        .map(dfs)
        .filter((x): x is TypeEventNode => x !== null);

      if (selfMatch || childMatches.length > 0) {
        return { ...n, children: childMatches };
      }
      return null;
    };

    for (const n of nodes) {
      const m = dfs(n);
      if (m) matches.push(m);
    }
    return matches;
  }, []);

  const filtered = React.useMemo(() => filterNodes(data, search), [data, search, filterNodes]);

  const renderSingleLabel = () => {
    if (internalValue === undefined || (internalValue as any) === null) {
      return <span className="text-muted-foreground">{placeholder}</span>;
    }
    const id = internalValue as number;
    const path = findPath(data, id) || [];
    if (!path.length) return <span className="text-muted-foreground">{placeholder}</span>;

    return (
      <div className="flex items-center gap-1 flex-wrap">
        {path.map((p, idx) => (
          <React.Fragment key={p.id}>
            {idx > 0 && <span className="text-muted-foreground">/</span>}
            <span className="truncate">{p.title}</span>
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderMultiLabel = () => {
    const ids = Array.isArray(internalValue) ? internalValue : [];
    if (ids.length === 0) return <span className="text-muted-foreground">{placeholder}</span>;
    return (
      <div className="flex flex-wrap gap-1">
        {ids.map((id) => {
          const path = findPath(data, id) || [];
          const label = path.map(p => p.title).join(" / ") || `#${id}`;
          return (
            <Badge key={id} variant="secondary" className="font-normal">
              {label}
            </Badge>
          );
        })}
      </div>
    );
  };

  const TreeItem: React.FC<{ node: TypeEventNode; level?: number }> = ({ node, level = 0 }) => {
    const hasChildren = (node.children?.length || 0) > 0;
    const openRow = expanded.has(node.id);

    return (
      <div>
        <CommandItem
          value={node.title}
          style={{ paddingInlineStart: Math.min(level * 16, 48) }}
          className="flex items-center gap-2 pr-2 pl-2"
          onSelect={() => toggleSelect(node.id)}
        >
          {hasChildren ? (
            <button
              type="button"
              className="p-0.5 rounded hover:bg-muted mr-1"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node.id);
              }}
              aria-label={openRow ? "Collapse" : "Expand"}
            >
              {openRow ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          ) : (
            <span className="w-4 mr-1" />
          )}

          <div className="flex-1 min-w-0 flex items-center gap-2">
            {node.icon_path ? (
              <img
                src={node.icon_path}
                alt={node.title}
                className="w-4 h-4 shrink-0"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            ) : null}
            <span className="truncate">{node.title}</span>
            {hasChildren && (
              <span className="text-xs text-gray-500 shrink-0">(دارای زیرمجموعه)</span>
            )}
          </div>

          <Check
            className={cn(
              "h-4 w-4 opacity-0 transition-opacity",
              isSelected(node.id) && "opacity-100"
            )}
          />
        </CommandItem>

        {hasChildren && openRow && (
          <div className="ml-6">
            {node.children!.map((c) => (
              <TreeItem key={c.id} node={c} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div dir={dir}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="popover-trigger-full">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between", className)}
            disabled={disabled}
          >
            {multiple ? renderMultiLabel() : renderSingleLabel()}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="popover-content-full p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder="جستجو در عنوان‌ها…"
            />
            <CommandList>
              <CommandEmpty>موردی یافت نشد</CommandEmpty>
              <CommandGroup heading="انواع حادثه">
                <ScrollArea className="h-72">
                  {filtered.map((n) => (
                    <TreeItem key={n.id} node={n} level={0} />
                  ))}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
