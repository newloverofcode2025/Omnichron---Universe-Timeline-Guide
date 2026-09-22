import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Position,
  Handle,
  MarkerType,
  Panel
} from '@xyflow/react';
import dagre from 'dagre';
import { TimelineItem, MediaFormat, CanonTier } from '../types';
import {
  Film,
  Tv,
  Gamepad2,
  BookOpen,
  Layers,
  Radio,
  CheckCircle2,
  Circle,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Maximize2,
  Sparkles,
  GitFork
} from 'lucide-react';

interface DAGTimelineGraphProps {
  items: TimelineItem[];
  completedItemIds: string[];
  onToggleComplete: (itemId: string) => void;
  onSelectItem: (item: TimelineItem) => void;
  selectedItemId?: string | null;
  orientation?: 'LR' | 'TB';
  onToggleOrientation?: () => void;
  activeBranchId?: string;
}

const getFormatIcon = (format: MediaFormat) => {
  switch (format) {
    case 'movie':
      return <Film className="w-3.5 h-3.5" />;
    case 'tv_series':
      return <Tv className="w-3.5 h-3.5" />;
    case 'video_game':
      return <Gamepad2 className="w-3.5 h-3.5" />;
    case 'book':
      return <BookOpen className="w-3.5 h-3.5" />;
    case 'comic':
      return <Layers className="w-3.5 h-3.5" />;
    case 'audio_drama':
      return <Radio className="w-3.5 h-3.5" />;
    default:
      return <Film className="w-3.5 h-3.5" />;
  }
};

const getCanonTierBadge = (tier: CanonTier) => {
  switch (tier) {
    case 'primary_canon':
      return { label: 'Canon', bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30' };
    case 'legends_extended':
      return { label: 'Legends', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
    case 'alternate_timeline':
      return { label: 'Branch', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
    case 'apocrypha':
      return { label: 'Apocrypha', bg: 'bg-stone-500/10 text-stone-400 border-stone-500/30' };
  }
};

interface CustomNodeData {
  item: TimelineItem;
  isCompleted: boolean;
  isSelected: boolean;
  onToggleComplete: (id: string) => void;
  onSelect: (item: TimelineItem) => void;
  orientation: 'LR' | 'TB';
}

const CustomTimelineNode: React.FC<{ data: CustomNodeData }> = ({ data }) => {
  const { item, isCompleted, isSelected, onToggleComplete, onSelect, orientation } = data;
  const badge = getCanonTierBadge(item.canonTier);

  return (
    <div
      id={`node-${item.id}`}
      onClick={() => onSelect(item)}
      className={`relative group w-64 rounded-xl border transition-all duration-200 cursor-pointer shadow-lg select-none text-left p-3.5
        ${isSelected
          ? 'bg-neutral-900 border-cyan-400 ring-2 ring-cyan-400/30 shadow-cyan-950/50'
          : isCompleted
          ? 'bg-neutral-900/90 border-emerald-500/40 hover:border-emerald-400'
          : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850'
        }
      `}
    >
      {/* Handles for DAG flow */}
      <Handle
        type="target"
        position={orientation === 'LR' ? Position.Left : Position.Top}
        className="!w-2.5 !h-2.5 !bg-neutral-500 !border-2 !border-neutral-900 group-hover:!bg-cyan-400"
      />
      <Handle
        type="source"
        position={orientation === 'LR' ? Position.Right : Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-neutral-500 !border-2 !border-neutral-900 group-hover:!bg-cyan-400"
      />

      {/* Top row: Format & Canon Badge & Completion Toggle */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-800 text-neutral-300 border border-neutral-700">
            {getFormatIcon(item.format)}
            <span className="capitalize">{item.format.replace('_', ' ')}</span>
          </span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${badge.bg}`}>
            {badge.label}
          </span>
        </div>

        <button
          id={`btn-complete-node-${item.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(item.id);
          }}
          title={isCompleted ? 'Mark as Unwatched' : 'Mark as Completed'}
          className={`p-1 rounded-full transition-colors ${
            isCompleted
              ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40'
              : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800'
          }`}
        >
          {isCompleted ? <CheckCircle2 className="w-5 h-5 fill-emerald-500/20" /> : <Circle className="w-5 h-5" />}
        </button>
      </div>

      {/* Title */}
      <h4 className="text-sm font-semibold text-neutral-100 line-clamp-1 leading-snug group-hover:text-cyan-300 transition-colors">
        {item.title}
      </h4>

      {/* Chronological & Release Dates */}
      <div className="flex items-center justify-between text-xs text-neutral-400 mt-2 pt-2 border-t border-neutral-800/80">
        <span className="font-mono text-cyan-400/90 font-medium">{item.chronologicalDateStr}</span>
        <span className="text-neutral-500">{item.releaseYear}</span>
      </div>

      {/* Branch & Essential Pill */}
      <div className="flex items-center justify-between gap-2 mt-2">
        {item.isEssential && (
          <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-amber-300 bg-amber-950/40 px-1.5 py-0.2 rounded border border-amber-800/40">
            <Sparkles className="w-2.5 h-2.5" /> Essential Core
          </span>
        )}
        <span className="text-[10px] text-neutral-500 ml-auto flex items-center gap-1 font-mono">
          <GitFork className="w-2.5 h-2.5" />
          {item.parentItemIds.length === 0 ? 'Root' : `${item.parentItemIds.length} dep`}
        </span>
      </div>
    </div>
  );
};

const nodeTypes = {
  timelineItem: CustomTimelineNode,
};

export const DAGTimelineGraph: React.FC<DAGTimelineGraphProps> = ({
  items,
  completedItemIds,
  onToggleComplete,
  onSelectItem,
  selectedItemId,
  orientation = 'LR',
  onToggleOrientation,
  activeBranchId = 'all',
}) => {
  const filteredItems = useMemo(() => {
    if (activeBranchId === 'all') return items;
    return items.filter((i) => i.branchId === activeBranchId);
  }, [items, activeBranchId]);

  // Compute layout using dagre
  const { layoutedNodes, layoutedEdges } = useMemo(() => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const nodeWidth = 280;
    const nodeHeight = 130;

    dagreGraph.setGraph({
      rankdir: orientation,
      nodesep: orientation === 'LR' ? 35 : 45,
      ranksep: orientation === 'LR' ? 80 : 70,
      align: 'UL',
    });

    // Filtered set for fast lookup
    const validItemIds = new Set(filteredItems.map((i) => i.id));

    filteredItems.forEach((item) => {
      dagreGraph.setNode(item.id, { width: nodeWidth, height: nodeHeight });
    });

    const edges: Edge[] = [];

    filteredItems.forEach((item) => {
      if (item.parentItemIds && item.parentItemIds.length > 0) {
        item.parentItemIds.forEach((parentId) => {
          if (validItemIds.has(parentId)) {
            dagreGraph.setEdge(parentId, item.id);
            const isCompletedEdge =
              completedItemIds.includes(parentId) && completedItemIds.includes(item.id);
            edges.push({
              id: `edge-${parentId}-${item.id}`,
              source: parentId,
              target: item.id,
              type: 'smoothstep',
              animated: !isCompletedEdge,
              style: {
                stroke: isCompletedEdge ? '#10b981' : '#64748b',
                strokeWidth: isCompletedEdge ? 2.5 : 1.5,
                strokeDasharray: isCompletedEdge ? 'none' : '4 4',
              },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: isCompletedEdge ? '#10b981' : '#64748b',
                width: 14,
                height: 14,
              },
            });
          }
        });
      }
    });

    dagre.layout(dagreGraph);

    const nodes: Node[] = filteredItems.map((item) => {
      const nodeWithPosition = dagreGraph.node(item.id);
      return {
        id: item.id,
        type: 'timelineItem',
        position: {
          x: nodeWithPosition ? nodeWithPosition.x - nodeWidth / 2 : 0,
          y: nodeWithPosition ? nodeWithPosition.y - nodeHeight / 2 : 0,
        },
        data: {
          item,
          isCompleted: completedItemIds.includes(item.id),
          isSelected: selectedItemId === item.id,
          onToggleComplete,
          onSelect: onSelectItem,
          orientation,
        },
      };
    });

    return { layoutedNodes: nodes, layoutedEdges: edges };
  }, [filteredItems, completedItemIds, selectedItemId, orientation, onToggleComplete, onSelectItem]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  // Sync state when layouted nodes change
  React.useEffect(() => {
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [layoutedNodes, layoutedEdges, setNodes, setEdges]);

  return (
    <div className="w-full h-[640px] lg:h-[720px] rounded-2xl border border-neutral-800/80 bg-neutral-950 overflow-hidden relative shadow-2xl">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={1.8}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#334155" gap={20} size={1} />
        <Controls showInteractive={false} position="bottom-right" />
        <MiniMap
          nodeStrokeWidth={3}
          nodeColor={(node) => {
            const isDone = completedItemIds.includes(node.id);
            return isDone ? '#10b981' : '#0284c7';
          }}
          maskColor="rgba(10, 15, 30, 0.75)"
          className="!bg-neutral-900/90 !border !border-neutral-800 rounded-lg overflow-hidden"
          position="bottom-left"
        />

        {/* Top Control Bar Panel */}
        <Panel position="top-right" className="bg-neutral-900/90 backdrop-blur-md p-2 rounded-xl border border-neutral-800 flex items-center gap-2 shadow-lg">
          {onToggleOrientation && (
            <button
              id="btn-toggle-graph-orientation"
              onClick={onToggleOrientation}
              className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 flex items-center gap-1.5 transition-colors"
              title="Toggle graph direction"
            >
              <ArrowRight className={`w-3.5 h-3.5 transition-transform ${orientation === 'TB' ? 'rotate-90' : ''}`} />
              <span>{orientation === 'LR' ? 'Horizontal (L → R)' : 'Vertical (T → B)'}</span>
            </button>
          )}

          <div className="flex items-center gap-2 pl-2 border-l border-neutral-800 text-[11px] text-neutral-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Completed
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Up Next / Pending
            </span>
          </div>
        </Panel>

        {/* Legend / Info Panel */}
        <Panel position="top-left" className="bg-neutral-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-neutral-800 text-xs text-neutral-300 shadow-lg flex items-center gap-2">
          <GitFork className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-neutral-100">DAG Branch Graph</span>
          <span className="text-neutral-500">•</span>
          <span className="text-neutral-400">Scroll to zoom · Drag to pan · Click node for details</span>
        </Panel>
      </ReactFlow>
    </div>
  );
};
