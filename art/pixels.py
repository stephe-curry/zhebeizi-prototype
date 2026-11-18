"""Draw the prototype's pixel cels and export editable clips plus the runtime atlas."""
import argparse
from dataclasses import dataclass
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

SIZE = 32
ROOT = Path(__file__).resolve().parents[1]
INK = "#352827"
PAPER = "#f3c787"
CREAM = "#fff0b0"
GOLD = "#c08a52"
WOOD = "#87563e"
DARK = "#593830"
GREEN = "#58736a"
JADE = "#8caa83"
RED = "#aa5145"
BLUE = "#5f8296"
MIST = "#afd2cf"

class Cel:
    def __init__(self):
        self.data = bytearray(SIZE * SIZE * 4)

    def pixel(self, x, y, color, alpha=255):
        if 0 <= x < SIZE and 0 <= y < SIZE:
            i = (y*SIZE+x)*4
            self.data[i:i+4] = bytes.fromhex(color.lstrip("#")) + bytes([alpha])

    def rect(self,x0,y0,x1,y1,color,alpha=255):
        for y in range(y0,y1+1):
            for x in range(x0,x1+1):
                self.pixel(x,y,color,alpha)

    def polygon(self,points,color):
        for y in range(min(p[1] for p in points),max(p[1] for p in points)+1):
            hits = []
            for (x1,y1),(x2,y2) in zip(points,points[1:]+points[:1]):
                if (y1 <= y < y2) or (y2 <= y < y1):
                    hits.append(x1+(y-y1)*(x2-x1)/(y2-y1))
            hits.sort()
            for left,right in zip(hits[::2],hits[1::2]):
                self.rect(round(left),y,round(right),y,color)

def stroke(c, start, end, color, width=1):
    x, y = start
    dx, dy = end[0]-x, end[1]-y
    steps = max(abs(dx), abs(dy), 1)
    for i in range(steps+1):
        px, py = x+round(i*dx/steps), y+round(i*dy/steps)
        c.rect(px,py,px+width-1,py+width-1,color)

def shadow(cel, x0=5, x1=27):
    cel.rect(x0,27,x1,28,INK,110)

def lamp_body():
    c=Cel()
    shadow(c)
    c.rect(10,24,24,27,INK)
    c.rect(12,23,22,25,WOOD)
    c.rect(16,12,18,23,DARK)
    c.rect(17,13,17,23,GOLD)
    c.polygon([(10,4),(23,4),(27,15),(25,17),(7,17),(5,15)],INK)
    c.polygon([(11,5),(22,5),(26,14),(7,14)],GREEN)
    c.polygon([(11,5),(14,5),(11,14),(7,14)],JADE)
    c.rect(8,15,25,16,DARK)
    c.pixel(21,11,CREAM)
    return c

def lamp_glow(level):
    c=Cel()
    for y in range(17,26):
        spread = (y-16)//2
        c.rect(9-spread,y,24+spread,y,PAPER,level*16)
    c.rect(8,15,25,16,[WOOD,GOLD,PAPER,CREAM,"#fff4ce"][level])
    length = [4,7,6,4,3][level]
    c.rect(24,17,24,16+length,DARK)
    c.rect(23,16+length,25,17+length,GOLD)
    if level >= 3:
        c.rect(5,26,11,26,PAPER,130)
        c.rect(23,26,28,26,PAPER,130)
    return c

def console_body():
    c=Cel()
    shadow(c)
    c.polygon([(4,9),(27,9),(30,12),(28,25),(25,27),(5,26),(2,23)],INK)
    c.polygon([(5,10),(26,10),(28,12),(26,24),(7,25),(4,22)],GOLD)
    c.rect(6,11,25,23,PAPER)
    c.rect(9,10,23,21,GREEN)
    c.rect(10,11,22,20,INK)
    c.rect(4,16,8,17,DARK)
    c.rect(5,15,6,18,DARK)
    c.rect(24,18,25,19,RED)
    c.rect(26,15,27,16,RED)
    return c

def console_screen(pose):
    c=Cel()
    if pose == 1:
        c.rect(11,15,21,16,MIST)
    elif pose >= 2:
        c.rect(10,11,22,20,JADE)
        c.rect(10,19,22,20,GREEN)
        x,y = [(12,16),(14,14),(16,12),(18,13),(19,16)][pose-2]
        c.rect(x,y,x+2,y+2,INK)
        c.pixel(x+2,y,CREAM)
        c.rect(15,17,16,18,WOOD)
        c.pixel(25,12,CREAM)
    return c

def book(cover=GREEN):
    c=Cel()
    shadow(c)
    c.polygon([(3,11),(23,8),(29,12),(28,26),(21,28),(3,25)],INK)
    c.polygon([(4,11),(22,9),(28,12),(27,23),(20,25),(4,22)],cover)
    c.polygon([(4,23),(20,26),(27,24),(27,25),(20,27),(4,24)],PAPER)
    c.rect(8,14,17,18,CREAM)
    c.rect(9,15,15,15,GOLD)
    c.rect(9,17,13,17,WOOD)
    return c

def letter_body():
    c=Cel()
    shadow(c)
    c.rect(4,14,27,26,INK)
    c.rect(5,15,26,25,GOLD)
    return c

def letter_flap(pose):
    c=Cel()
    tip = [23,19,14,8,5,5][pose]
    c.polygon([(4,14),(16,tip),(27,14),(26,16),(16,tip+2),(5,16)],DARK)
    c.polygon([(5,14),(16,tip),(26,14)],PAPER if tip>=14 else GOLD)
    if pose < 2:
        c.rect(14,tip-2,18,tip,RED)
        c.pixel(15,tip-2,CREAM)
    return c

def letter_insert(pose):
    if pose < 3:
        return None
    c=Cel()
    top = [12,6,2][pose-3]
    c.rect(8,top,23,20,WOOD)
    c.rect(9,top+1,22,20,CREAM)
    c.rect(11,top+3,19,top+3,WOOD)
    c.rect(11,top+5,17,top+5,GOLD)
    c.rect(17,top+7,20,top+10,RED)
    return c

def letter_pocket(pose):
    c=Cel()
    top = 17 if pose > 1 else 20
    c.polygon([(5,top-1),(16,top+4),(26,top-1),(26,26),(5,26)],PAPER)
    c.polygon([(5,25),(16,top+2),(26,25),(26,26),(5,26)],GOLD)
    c.rect(23,22,26,24,GOLD)
    return c

def box_body():
    c=Cel()
    shadow(c)
    c.polygon([(5,12),(21,9),(28,13),(27,25),(20,29),(5,25)],INK)
    c.polygon([(6,15),(20,18),(20,27),(6,24)],GOLD)
    c.polygon([(20,18),(27,14),(26,24),(20,27)],WOOD)
    c.polygon([(6,13),(21,10),(27,13),(20,17)],DARK)
    c.rect(12,16,14,23,PAPER)
    return c

def box_contents(pose):
    if pose < 3:
        return None
    c=Cel()
    top = [13,9,7][pose-3]
    c.rect(11,top,20,17,INK)
    c.rect(12,top+1,19,16,CREAM)
    c.rect(13,top+2,18,top+5,BLUE)
    c.pixel(14,top+3,PAPER)
    c.rect(20,13,24,15,RED)
    return c

def box_flaps(pose):
    c=Cel()
    if pose == 0:
        c.polygon([(6,13),(21,10),(27,13),(20,17)],PAPER)
        c.polygon([(12,12),(15,11),(21,14),(18,15)],CREAM)
    else:
        # Hinges stay on the rim as both flaps swing outward.
        lx,ly = [(9,8),(6,4),(2,6),(0,10),(0,12)][pose-1]
        rx,ry = [(24,6),(25,3),(28,4),(30,7),(31,9)][pose-1]
        c.polygon([(6,13),(lx,ly),(lx+3,ly+2),(10,15),(6,15)],INK)
        c.polygon([(6,13),(lx+1,ly+1),(lx+3,ly+2),(9,14)],PAPER)
        c.polygon([(22,10),(rx,ry),(31,ry+1),(27,14),(24,13)],DARK)
        c.polygon([(23,10),(rx,ry+1),(30,ry+1),(27,13)],GOLD)
    return c

def open_spread(cover, pose):
    if pose < 2:
        return book(cover)
    c=Cel()
    shadow(c,3,29)
    c.polygon([(2,13),(13,10),(16,12),(22,9),(30,10),(30,24),(23,27),(16,25),(10,28),(2,25)],INK)
    c.polygon([(3,13),(13,11),(16,13),(22,10),(29,11),(29,24),(23,26),(16,24),(10,27),(3,24)],cover)
    c.polygon([(4,12),(12,10),(15,12),(15,23),(10,25),(4,23)],PAPER)
    c.polygon([(17,12),(23,10),(28,10),(28,23),(23,24),(17,22)],CREAM)
    c.rect(15,13,16,22,GOLD)
    return c

def turning_page(pose, album=False):
    if pose == 0:
        return None
    c=Cel()
    if pose >= 2:
        if album:
            for x,y,sky in [(6,14,BLUE),(21,13,GREEN)]:
                c.rect(x,y,x+6,y+7,WOOD)
                c.rect(x+1,y+1,x+5,y+5,sky)
                c.rect(x+2,y+2,x+3,y+3,PAPER)
                c.rect(x+2,y+4,x+4,y+5,RED)
        else:
            for x in (6,20):
                c.rect(x,14,x+6,15,RED)
                for dx in (0,3):
                    for y in (17,20):
                        c.rect(x+dx,y,x+dx+1,y+1,BLUE)
            if pose == 5:
                stroke(c,(22,20),(23,21),RED)
                stroke(c,(23,21),(27,17),RED)
    if pose <= 4:
        edge,top = [(24,6),(28,5),(20,2),(7,7)][pose-1]
        c.polygon([(16,12),(edge,top),(edge+2,top+1),(edge+2,top+12),(16,25)],WOOD)
        c.polygon([(16,12),(edge,top+1),(edge+1,top+2),(edge+1,top+11),(16,24)],CREAM)
        if abs(edge-16)>5:
            stroke(c,(edge,top+4),(edge,top+8),BLUE if album else RED,2)
    return c

def yearbook():
    c=open_spread(GREEN,5)
    c.rect(4,16,11,16,WOOD)
    c.rect(5,19,9,19,GOLD)
    c.rect(7,22,12,22,BLUE)
    c.polygon([(18,13),(21,15),(25,15),(27,12),(27,20),(24,22),(20,21),(18,19)],DARK)
    c.polygon([(19,15),(21,16),(25,16),(26,15),(26,19),(24,21),(20,20)],PAPER)
    c.pixel(21,17,INK)
    c.pixel(25,17,INK)
    c.pixel(23,19,RED)
    return c

def badge():
    c=Cel()
    shadow(c,8,24)
    c.polygon([(13,5),(17,5),(19,11),(22,12),(23,28),(8,28),(8,12)],INK)
    c.rect(11,13,20,25,CREAM)
    c.rect(13,15,18,19,BLUE)
    c.rect(14,16,17,17,PAPER)
    c.rect(12,21,19,21,WOOD)
    c.rect(12,23,16,23,GOLD)
    c.rect(14,7,16,11,RED)
    return c

def photo():
    c=Cel()
    shadow(c)
    c.polygon([(5,7),(24,9),(27,28),(7,26)],INK)
    c.polygon([(6,8),(23,10),(26,27),(8,25)],CREAM)
    c.polygon([(8,11),(21,12),(23,22),(9,21)],BLUE)
    c.rect(11,15,15,17,GOLD)
    c.rect(12,18,14,21,RED)
    c.rect(17,14,20,16,PAPER)
    c.rect(17,17,20,21,GREEN)
    return c

def phone_body():
    c=Cel()
    shadow(c,8,24)
    c.polygon([(10,5),(23,5),(25,8),(23,27),(8,27),(7,24)],INK)
    c.rect(10,8,22,23,GREEN)
    c.rect(11,10,21,21,INK)
    c.rect(14,25,17,25,GOLD)
    return c

def phone_screen(pose):
    c=Cel()
    if pose:
        c.rect(10,9,22,22,BLUE)
        c.rect(10,9,22,10,MIST)
    if pose >= 2:
        top = [8,11,14,13][pose-2]
        c.rect(10,top,22,top+6,INK)
        c.rect(11,top+1,21,top+5,CREAM)
        stroke(c,(11,top+1),(16,top+4),RED)
        stroke(c,(16,top+4),(21,top+1),RED)
    return c

def phone_pulse(pose):
    c=Cel()
    if pose in (1,2,3):
        for side in (-1,1):
            x = 16+side*[0,10,12,13][pose]
            y = 13
            stroke(c,(x,y),(x+side*2,y+2),PAPER)
            stroke(c,(x+side*2,y+2),(x+side*2,y+5),CREAM)
            stroke(c,(x+side*2,y+5),(x,y+7),PAPER)
    return c

def glove():
    c=Cel()
    shadow(c)
    c.polygon([(3,18),(3,12),(5,10),(9,14),(9,9),(11,7),(13,8),(13,14),(17,13),(17,7),(19,5),(21,7),(21,12),(24,9),(27,10),(28,13),(26,24),(20,28),(7,26)],INK)
    c.polygon([(4,18),(5,12),(10,16),(10,9),(12,9),(12,16),(18,15),(18,7),(20,7),(20,15),(25,11),(27,12),(25,23),(21,26),(8,25)],GOLD)
    c.rect(8,21,24,22,CREAM)
    c.rect(10,23,22,24,RED)
    return c

def rain(frame,near):
    c=Cel()
    seeds = [(7,4),(17,19),(29,9)] if near else [(4,12),(12,3),(22,24),(31,17)]
    for x,y in seeds:
        head = (y+frame*(8 if near else 4))%32
        for step in range(7 if near else 4):
            c.pixel(x-step//3,(head+step)%32,CREAM if near and step>4 else MIST,210 if near else 110)
    if near:
        for x,phase in [(6,1),(17,5),(27,7)]:
            t=(frame+phase)%8
            if t<3:
                c.pixel(x-t-1,28-(t==1),MIST)
                c.pixel(x+t+1,28-(t==1),MIST)
    return c

def dust(frame,near):
    c=Cel()
    seeds = [(6,17),(19,7),(26,24)] if near else [(11,6),(23,13),(4,28),(17,22)]
    for i,(x,y) in enumerate(seeds):
        phase = (frame+3*i)%10
        dx = [0,1,2,2,1,0,-1,-2,-2,-1][phase]
        dy = [0,0,-1,-2,-3,-3,-2,-1,0,1][phase]
        x,y=x+dx,y+dy
        c.pixel(x,y,CREAM,245 if near else 140)
        if near and 2<=phase<=6:
            c.rect(x-1,y,x+1,y,PAPER)
            c.rect(x,y-1,x,y+1,CREAM)
    return c

def leaves(frame,near):
    c=Cel()
    seeds = [(7,5),(23,20)] if near else [(15,10),(28,2),(4,24)]
    for i,(x,y) in enumerate(seeds):
        phase = (frame+i*3)%10
        x += [0,2,4,5,4,2,0,-2,-3,-2][phase]
        y = (y+phase*3)%32
        width = [2,3,4,3,2,1,2,3,4,3][phase] if near else 2
        tilt = 1 if phase<5 else -1
        c.polygon([(x-width,y+tilt),(x,y-2),(x+width,y-tilt),(x+1,y+2)],WOOD if near else GREEN)
        stroke(c,(x-width+1,y+tilt),(x+width-1,y-tilt),PAPER if near else JADE)
    return c

def light(frame,near):
    c=Cel()
    offset = [0,1,2,3,2,1][frame]
    if near:
        for y in range(22,27):
            x=4+(26-y)*2+offset
            c.rect(x,y,x+8,y,PAPER,65+offset*12)
    else:
        for y in range(26):
            x=19-y//2+offset
            c.rect(x,y,x+4,y,CREAM,46)
            c.rect(x+7,y,x+9,y,PAPER,28)
    return c

def desk():
    c = Cel()
    c.rect(2,26,30,29,INK)
    c.rect(2,26,30,26,"#dbab73")
    c.rect(3,27,29,28,WOOD)
    c.rect(4,29,6,31,DARK)
    c.rect(26,29,28,31,DARK)
    return c

SHIRTS = (BLUE,GREEN,RED)
SLEEVE = ("#9acddd","#abbd83","#da8071")
# Head motion follows the working hand, with a longer gaze at the result.
HEAD_TILTS = (
    [(0,0),(1,0),(2,1),(2,2),(2,1),(1,0),(0,0)],
    [(0,0),(0,1),(1,0),(0,1),(1,0),(1,-1),(0,-1)],
    [(0,0),(1,0),(2,-1),(1,-1),(0,0),(-1,1),(0,1)],
)

def character_torso(age):
    c = Cel()
    c.rect(1,16,4,25,INK)
    c.rect(2,17,3,24,GOLD)
    c.polygon([(5,14),(11,13),(15,17),(14,26),(3,26),(3,19)],INK)
    c.polygon([(6,15),(11,14),(14,18),(12,24),(4,24),(4,19)],SHIRTS[age])
    c.rect(5,22,7,24,DARK)
    c.polygon([(8,15),(11,14),(13,16),(11,19)],CREAM)
    return c

def character_head(age, pose):
    c = Cel()
    x,y = HEAD_TILTS[age][pose]
    y += 2 if age == 0 else 1
    def shape(points,color):
        c.polygon([(px+x,py+y) for px,py in points],color)
    def mark(px,py,color):
        c.pixel(x+px,y+py,color)
    shape([(4,3),(8,1),(12,2),(15,5),(15,8),(17,10),(15,11),
           (14,14),(10,15),(7,13),(4,11),(3,7)],INK)
    shape([(7,5),(13,5),(14,8),(16,10),(14,10),(13,13),(10,14),(7,11)],PAPER)
    hair = [DARK,"#433736","#c2bcb0"][age]
    shape([(4,4),(8,2),(12,3),(14,5),(13,7),(10,6),(9,9),(7,8),
           (7,12),(5,11),(4,9)],hair)
    stroke(c,(x+6,y+4),(x+9,y+3),[WOOD,"#76584d",CREAM][age])
    mark(7,9,GOLD)
    mark(13,8,INK)
    mark(13,12,WOOD)
    if age == 0:
        shape([(4,6),(3,6),(1,9),(1,12),(4,10),(5,8)],DARK)
        mark(4,7,RED)
    if age == 2:
        stroke(c,(x+8,y+8),(x+15,y+8),DARK)
        c.rect(x+12,y+9,x+14,y+9,MIST)
        mark(14,10,WOOD)
    return c

# Pen nib and page corner share coordinates with the hand holding them.
NIB = [(17,19),(16,24),(19,24),(23,24),(26,24),(26,20),(21,17)]
PAGE = [(29,21),(29,18),(26,13),(22,12),(17,16),(16,21),(18,22)]
KEYS = [(16,21,21,23),(16,24,22,20),(17,20,22,24),(17,24,23,20),
        (18,20,23,24),(17,22,21,21),(16,21,20,22)]

def character_prop(age, pose):
    c = Cel()
    if age == 0:
        c.polygon([(12,23),(24,21),(31,23),(28,27),(11,27)],INK)
        c.polygon([(13,23),(24,22),(30,23),(27,26),(12,26)],CREAM)
        if 1 <= pose <= 5:
            stroke(c,(16,24),(min(NIB[pose][0],25),24),BLUE)
        x,y = NIB[pose]
        stroke(c,(x,y-1),(x+3,y-8),INK,2)
        stroke(c,(x+1,y-3),(x+3,y-7),"#edab44")
        c.rect(x+3,y-9,x+4,y-8,RED)
    elif age == 1:
        c.polygon([(20,10),(31,9),(30,21),(18,22)],INK)
        c.polygon([(21,12),(29,11),(28,19),(20,20)],BLUE)
        c.rect(22,13,27,13,MIST)
        c.rect(21,16,22+min(pose,4),16,CREAM)
        c.polygon([(17,21),(29,20),(31,24),(27,26),(13,26)],INK)
        c.polygon([(18,22),(28,21),(30,24),(15,25)],"#a4b4ab")
        for key in (17,20,23,26):
            c.rect(key,24,key+1,24,DARK)
    else:
        c.polygon([(12,23),(16,20),(22,21),(27,19),(31,20),(31,25),(23,27),(12,26)],INK)
        c.polygon([(13,23),(17,21),(22,22),(28,20),(30,21),(30,24),(23,26),(13,25)],CREAM)
        c.rect(16,22,20,24, BLUE if pose<4 else GREEN)
        c.rect(25,22,28,24, GREEN if pose<4 else BLUE)
        if pose in (1,2,3,4,5):
            x,y = PAGE[pose]
            c.polygon([(22,22),(x,y),(x+2,y+1),(x+2,y+5),(22,26)],WOOD)
            c.polygon([(22,22),(x,y+1),(x+1,y+1),(x+1,y+4),(22,25)],CREAM)
    return c

def character_hands(age, pose):
    c = Cel()
    def arm(shoulder,elbow,hand):
        stroke(c,shoulder,elbow,INK,4)
        stroke(c,elbow,hand,INK,3)
        stroke(c,shoulder,elbow,SHIRTS[age],3)
        stroke(c,elbow,hand,SLEEVE[age],2)
        c.rect(hand[0],hand[1],hand[0]+2,hand[1]+1,PAPER)
    if age == 1:
        lx,ly,rx,ry = KEYS[pose]
        arm((10,16),(15,18),(rx,ry-1))
        arm((6,18),(9,23),(lx,ly-1))
    elif age == 0:
        arm((9,17),(9,23),(13,23))
        x,y = NIB[pose]
        arm((7,17),(10,21),(x,y-4))
    else:
        arm((8,17),(8,23),(13,23))
        x,y = PAGE[pose]
        arm((10,17),(14,20),(x-1,y))
    return c

@dataclass
class Clip:
    durations: tuple
    layers: dict
    source: str = ""
    tag: str = ""

def still(cel):
    return Clip((200,),{"道具": [cel]})

def resident(age,source,tag,durations):
    poses = range(len(durations))
    return Clip(durations,{
        "躯干与椅背": [character_torso(age)] * len(durations),
        "头部与表情": [character_head(age,pose) for pose in poses],
        "桌沿与投影": [desk()] * len(durations),
        ("习字本与铅笔","电脑与键盘","家庭相册")[age]: [character_prop(age,pose) for pose in poses],
        "手臂与指尖": [character_hands(age,pose) for pose in poses],
    },source,tag)

def passing(age,source):
    durations=(220,130,140,220,130,180,400)
    hands,objects=[],[]
    for i,(x,y) in enumerate([(12,21),(15,19),(19,18),(23,17),(24,17),(19,20),(13,22)]):
        arm=Cel()
        stroke(arm,(8,17),(10,21),INK,4)
        stroke(arm,(10,21),(x,y),INK,3)
        stroke(arm,(8,17),(10,21),SHIRTS[age],3)
        stroke(arm,(10,21),(x,y),SLEEVE[age],2)
        arm.rect(x,y,x+2,y+1,PAPER)
        prop=Cel()
        px,py=(x,y) if i<5 else (25,17)
        prop.rect(px-1,py-3,px+4,py-1,INK)
        prop.rect(px,py-3,px+3,py-2,CREAM)
        prop.pixel(px+2,py-3,RED)
        hands.append(arm)
        objects.append(prop)
    return Clip(durations,{"椅背与躯干":[character_torso(age)]*7,
        "头部":[character_head(age,i) for i in range(7)],"桌沿":[desk()]*7,
        "递出的手":hands,"物件":objects},source,"pass")

def weather(draw, count, duration, source, tag):
    return Clip((duration,)*count,{
        "远层": [draw(i,False) for i in range(count)],
        "近层": [draw(i,True) for i in range(count)],
    },source,tag)

def pages(cover,album,source,tag):
    durations = (260,150,170,230,160,650)
    return Clip(durations,{
        "书封与书脊": [open_spread(cover,i) for i in range(len(durations))],
        "翻动页与内容": [turning_page(i,album) for i in range(len(durations))],
    },source,tag)

def drawings():
    return {
        **{name:passing(age,name) for age,name in enumerate(("child-pass","adult-pass","elder-pass"))},
        "lamp": Clip((420,120,220,140,580,210),{
            "灯罩与底座": [lamp_body()]*6,
            "暖光": [lamp_glow(i) for i in (3,1,4,0,2,4)],
        },"lamp-flicker","flicker"),
        "console": Clip((220,105,200,160,165,140,450),{
            "外壳与按键": [console_body()]*7,
            "开机画面": [console_screen(i) for i in (0,1,2,3,4,5,6)],
        },"handheld-startup","startup"),
        "book": still(book()),
        "yearbook": still(yearbook()),
        "letter": Clip((240,130,130,180,200,630),{
            "信封背面": [letter_body()]*6,
            "封舌": [letter_flap(i) for i in range(6)],
            "信纸": [letter_insert(i) for i in range(6)],
            "信封前袋": [letter_pocket(i) for i in range(6)],
        },"letter-opening","open"),
        "badge": still(badge()),
        "glove": still(glove()),
        "box": Clip((230,150,150,170,190,600),{
            "纸箱与投影": [box_body()]*6,
            "箱内纪念物": [box_contents(i) for i in range(6)],
            "箱盖": [box_flaps(i) for i in range(6)],
        },"keepsake-box-opening","open"),
        "photo": still(photo()),
        "phone": Clip((240,130,140,175,130,510),{
            "手机外壳": [phone_body()]*6,
            "亮屏与通知": [phone_screen(i) for i in range(6)],
            "短震波纹": [phone_pulse(i) for i in range(6)],
        },"phone-notification","notify"),
        "planner": pages(BLUE,False,"planner-page","unfold"),
        "album": pages(RED,True,"memoir-album-page","page-turn"),
        "rain": weather(rain,8,85,"window-rain","rain-loop"),
        "dust": weather(dust,10,140,"window-motes","motes-loop"),
        "leaves": weather(leaves,10,155,"window-leaves","leaves-loop"),
        "light": weather(light,6,310,"window-light","glow-loop"),
        "child": resident(0,"child-writing","write",(550,130,180,150,130,210,130)),
        "adult": resident(1,"adult-typing","type",(510,110,105,125,110,245,125)),
        "elder": resident(2,"elder-album","page-turn",(540,160,190,195,180,240,130)),
    }

def save_manifest(directory,durations,layers,tags,filename):
    path = directory / filename
    path.write_text(json.dumps({
        "width":SIZE,
        "height":SIZE,
        "durations":durations,
        "layers":[{"name":name,"frames":frames} for name,frames in layers.items()],
        "tags":tags,
    },ensure_ascii=False),encoding="utf-8")
    return path

def save_cels(directory,asset,clip):
    paths = {}
    for layer_index,(layer,frames) in enumerate(clip.layers.items()):
        if len(frames) != len(clip.durations):
            raise ValueError(f"{asset}: 帧时长与 {layer} 图层不一致")
        files = []
        for index,cel in enumerate(frames):
            name = f"{asset}-{layer_index}-{index}.rgba" if cel else None
            if name:
                (directory/name).write_bytes(cel.data)
            files.append(name)
        paths[layer] = files
    return paths

def export_all(exporter,directory,clips):
    durations, tags = [], []
    atlas_layers = {f"图层 {i+1}":[] for i in range(max(len(clip.layers) for clip in clips.values()))}
    for asset,clip in clips.items():
        layers = save_cels(directory,asset,clip)
        start = len(durations)
        durations.extend(clip.durations)
        tags.append({"name":asset,"from":start,"to":len(durations)-1})
        frames = list(layers.values())
        for index,atlas_frames in enumerate(atlas_layers.values()):
            atlas_frames.extend(frames[index] if index < len(frames) else [None]*len(clip.durations))
        if clip.source:
            local_tag = {"name":clip.tag,"from":0,"to":len(clip.durations)-1}
            path = save_manifest(directory,clip.durations,layers,[local_tag],f"{asset}-manifest.json")
            subprocess.run([sys.executable,str(exporter),str(path),str(directory/clip.source)],
                           check=True,capture_output=True)
    manifest = save_manifest(directory,durations,atlas_layers,tags,"manifest.json")
    subprocess.run([sys.executable,str(exporter),str(manifest),str(directory/"objects")],
                   check=True,capture_output=True)

def publish(directory,clips):
    art = ROOT/"art"
    sources = art/"animations"
    sources.mkdir(exist_ok=True)
    for clip in clips.values():
        if clip.source:
            name = clip.source+".aseprite"
            shutil.copyfile(directory/name,sources/name)
    shutil.copyfile(directory/"objects.aseprite",art/"objects.aseprite")
    for ext in ("png","json"):
        name = f"objects.{ext}"
        shutil.copyfile(directory/name,ROOT/"assets"/name)
    metadata = json.loads((directory/"objects.json").read_text())
    compact = {"size":metadata["meta"]["size"],"tags":{
        tag["name"]:[[frame["frame"]["x"],frame["frame"]["y"],frame["duration"]]
                    for frame in metadata["frames"][tag["from"]:tag["to"]+1]]
        for tag in metadata["meta"]["frameTags"]
    }}
    (ROOT/"sprite-data.js").write_text("'use strict';\nglobalThis.LifeSprites = "+json.dumps(compact)+";\n")

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("skill",type=Path,help="aseprite-pixel-animation skill directory")
    args = parser.parse_args()
    exporter = args.skill/"scripts"/"build_pixels.py"
    clips = drawings()
    with tempfile.TemporaryDirectory(prefix="life13-cels-") as tmp:
        directory = Path(tmp)
        export_all(exporter,directory,clips)
        publish(directory,clips)
    print(f"Exported {sum(bool(clip.source) for clip in clips.values())} editable animations")

if __name__ == "__main__":
    main()
