#!/usr/bin/env python3

import functools
import itertools
import re
from collections import Counter, defaultdict
from copy import deepcopy
from typing import Dict, List

import numpy as np

import re
import os


def process(relative_input_path, func, result_descriptor="Result"):
    input_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), relative_input_path
    )
    with open(input_path, "r") as f:
        input = f.read()

    result = func(input)
    print(f"\n{result_descriptor}: {result}")


def lmap(func, *iterables):
    return list(map(func, *iterables))


def lfilter(func, *iterables):
    return list(filter(func, *iterables))


def ints(s):
    return lmap(int, re.findall(r"-?\d+", s))  # thanks mserrano!

import math
import scipy.signal
from enum import Enum


class EdgeSense(Enum):
    TOP = 0
    RIGHT = 1
    BOTTOM = 2
    LEFT = 3


def get_image_edge(tile: np.ndarray, edge_sense: EdgeSense):
    """
    Returns the relevant edge read clockwise
    """
    if edge_sense == EdgeSense.TOP:
        return "".join(tile[0, :])
    if edge_sense == EdgeSense.RIGHT:
        return "".join(tile[:, -1])
    if edge_sense == EdgeSense.BOTTOM:
        return "".join(tile[-1, :][::-1])
    if edge_sense == EdgeSense.LEFT:
        return "".join(tile[:, 0][::-1])


def p1(input: str):
    tile_infos = input.split("\n\n")

    edges_to_tile_ids = defaultdict(list)

    for tile_info in tile_infos:
        tile_lines = lmap(lambda s: s.strip(), tile_info.splitlines())
        tile_id = ints(tile_lines[0])[0]
        tile = np.array(lmap(list, tile_lines[1:]))
        for edge_sense in EdgeSense:
            edge = get_image_edge(tile, edge_sense)
            edges_to_tile_ids[edge].append(tile_id)
            # this accounts for the image when flipped
            edges_to_tile_ids[edge[::-1]].append(tile_id)

    num_unmatched_edges = Counter()
    for edge, tile_ids in edges_to_tile_ids.items():
        if len(tile_ids) == 1:
            num_unmatched_edges[tile_ids[0]] += 1

    # since we add both the tile and its flipped version, we double-count the number of unmatched edges
    corner_candidates = [
        tile_id for tile_id in num_unmatched_edges if num_unmatched_edges[tile_id] == 4
    ]
    print(corner_candidates)
    return math.prod(corner_candidates)


def get_all_views(tile: np.ndarray):
    for k in range(4):
        rotated_tile = np.rot90(tile, k)
        for do_fliplr in [False, True]:
            if do_fliplr:
                rotated_tile = np.fliplr(rotated_tile)
            yield rotated_tile


def get_matching_view(template_edge: str, tile: np.ndarray, edge_sense: EdgeSense):
    """
    Returns the rotated / flipped view of tile such that `edge_sense` corresponds to the `template_edge`
    """
    for tile_view in get_all_views(tile):
        if get_image_edge(tile_view, edge_sense) == template_edge:
            return tile_view

    raise ValueError("No matching view found but one was expected.")


def get_matching_tile_id(
    edges_to_tile_ids: Dict[str, List[int]], edge: str, current_tile_id: int
):
    matching_tile_ids = lfilter(lambda x: x != current_tile_id, edges_to_tile_ids[edge])
    assert len(matching_tile_ids) == 1
    return matching_tile_ids[0]


def propagate(
    tiles: Dict[int, np.ndarray],
    edges_to_tile_ids: Dict[str, List[int]],
    initial_tile: np.ndarray,
    initial_tile_id: int,
    propagation_edge_sense: EdgeSense,
    num_propagations: int,
):
    propagation_inverse_edge_sense = EdgeSense((propagation_edge_sense.value - 2) % 4)

    cur_tiles = [initial_tile]
    cur_tile_ids = [initial_tile_id]
    for _ in range(num_propagations):
        current_bottom_edge = get_image_edge(cur_tiles[-1], propagation_edge_sense)
        next_tile_id = get_matching_tile_id(
            edges_to_tile_ids, current_bottom_edge, cur_tile_ids[-1]
        )
        next_tile = get_matching_view(
            current_bottom_edge[::-1],
            tiles[next_tile_id],
            propagation_inverse_edge_sense,
        )
        cur_tiles.append(next_tile)
        cur_tile_ids.append(next_tile_id)
    return cur_tiles, cur_tile_ids


def p2(input: str):
    tile_infos = input.split("\n\n")

    edges_to_tile_ids = defaultdict(list)
    tiles = dict()

    for tile_info in tile_infos:
        tile_lines = lmap(lambda s: s.strip(), tile_info.splitlines())
        tile_id = ints(tile_lines[0])[0]

        tile = np.array(lmap(list, tile_lines[1:]))
        tiles[tile_id] = tile

        for edge_sense in EdgeSense:
            edge = get_image_edge(tile, edge_sense)
            edges_to_tile_ids[edge].append(tile_id)
            # this accounts for the image when flipped
            edges_to_tile_ids[edge[::-1]].append(tile_id)

    num_unmatched_edges = Counter()
    for edge, tile_ids in edges_to_tile_ids.items():
        if len(tile_ids) == 1:
            num_unmatched_edges[tile_ids[0]] += 1

    # since we add both the tile and its flipped version, we double-count the number of unmatched edges
    corners = [
        tile_id for tile_id in num_unmatched_edges if num_unmatched_edges[tile_id] == 4
    ]

    unmatched_edges = [
        edge for edge in edges_to_tile_ids if len(edges_to_tile_ids[edge]) == 1
    ]

    side_length_in_tiles = int(math.sqrt(len(tiles)))

    top_left_tile_id = corners[0]
    top_left_tile_unaligned = tiles[top_left_tile_id]

    top_left_tile = None
    for tile_view in get_all_views(top_left_tile_unaligned):
        if all(
            get_image_edge(tile_view, es) in unmatched_edges
            for es in [EdgeSense.TOP, EdgeSense.LEFT]
        ):
            top_left_tile = tile_view
    assert top_left_tile is not None

    left_tiles, left_tile_ids = propagate(
        tiles,
        edges_to_tile_ids,
        top_left_tile,
        top_left_tile_id,
        EdgeSense.BOTTOM,
        side_length_in_tiles - 1,
    )

    trimmed_rows = []

    for left_tile, left_tile_id in zip(left_tiles, left_tile_ids):
        row_tiles, row_tile_ids = propagate(
            tiles,
            edges_to_tile_ids,
            left_tile,
            left_tile_id,
            EdgeSense.RIGHT,
            side_length_in_tiles - 1,
        )
        # we need to trim each tile
        trimmed_row_tiles = lmap(lambda arr: arr[1:-1, 1:-1], row_tiles)

        trimmed_rows.append(np.hstack(trimmed_row_tiles))

    master_image = np.vstack(trimmed_rows)

    for row in master_image:
        print("".join(row))

    sea_monster = """                  # 
#    ##    ##    ###
 #  #  #  #  #  #   
"""
    sea_monster_arr = (
        np.array(list(map(list, sea_monster.splitlines()))) == "#"
    ).astype(int)
    sea_monster_size = sum(sum(sea_monster_arr))

    master_image_arr = (master_image == "#").astype(int)

    for sea_monster_arr_view in get_all_views(sea_monster_arr):
        correlation_arr = scipy.signal.correlate(
            master_image_arr, sea_monster_arr_view, mode="valid"
        )
        num_sea_monsters = sum(sum((correlation_arr == sea_monster_size).astype(int)))

        if num_sea_monsters > 0:
            return int(sum(sum(master_image_arr)) - sea_monster_size * num_sea_monsters)



# process("day20Input.txt", p1)
# process("day20Input.txt", p2)