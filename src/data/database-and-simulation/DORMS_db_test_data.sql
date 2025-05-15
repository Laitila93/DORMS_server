-- Test Data
INSERT INTO fishes (name, rarity, description, price, image) VALUES
('European Perch', 'Common', 'A classic freshwater predator with vivid stripes.', 0, 'https://i.imgur.com/oruogeJ.png'),
('Shadowfin', 'Rare', 'Moves like a shadow in the water.', 1000, 'https://i.imgur.com/oJ83UX7.png'),
('Steve', 'Legendary', 'Surrounded by a mysterious aura of bubbles.', 2000, 'https://i.imgur.com/3T021xC.png'),
('Grumpy Pike', 'Uncommon', 'Always looks like it just woke up on the wrong side of the river.', 800, 'https://i.imgur.com/4b41pd5.png'),
('Happy Pike', 'Rare', 'Unusually cheerful for a pike, loves to swim in circles.', 300, 'https://i.imgur.com/WZQh4h8.png'),
('Moose-Fish', 'Legendary', 'An absurd hybrid with antlers and gills—sighted only during full moons.', 1500, 'https://i.imgur.com/lA2AfLK.png'),
('Scuba Diving Corgi', 'Epic', 'Wears flippers and goggles, excels at underwater fetch.', 3000, 'https://i.imgur.com/QdYGQUz.png'),
('Salmon in a Tux', 'Epic', 'Sharp-dressed and ready to dance at Uppsala’s finest student nation soirées.', 4500, 'https://i.imgur.com/ELYqCv7.png'),
('Gala Salmon', 'Rare', 'Graceful and elegant in a flowing ball gown—she twirls through the Fyrisån in style.', 5000, 'https://i.imgur.com/QnDqaJp.png'),
('Raft Fish', 'Uncommon', 'A rebellious little fish on a makeshift student raft, braving the Valborg river rush.', 20000, 'https://i.imgur.com/VTxL7p5.png'),
('Galloping Goldfish', 'Epic', 'Somehow keeps pace in the Champagne Gallop—sloshing with style and spirit.', 2600, 'https://i.imgur.com/PIiIibw.png');


INSERT INTO hats (name, description, price, image) VALUES
('Top Hat', 'A classy hat for classy fish.', 1000, 'https://i.imgur.com/TWk8kwQ.png'),
('Moose Hat', 'Arrr! Swab the deck!', 5000, 'https://i.imgur.com/3b3EdNI.png'),
('Winter Tuque', 'Keeps your head cozy during the chilliest underwater blizzards.', 0, 'https://i.imgur.com/678InA9.png'),
('Party Hat', 'Bright, pointy, and full of good vibes. Let’s get festive!', 2500, 'https://i.imgur.com/riEbssv.png'),
('Student Hat', 'A proud symbol of graduation and summer freedom in Sweden.', 10000, 'https://i.imgur.com/Dg3mx8r.png');


INSERT INTO specials (name, description, price, image) VALUES
('Raft', 'It floats...?', 1000, 'https://imgur.com/v7OkFvu.png'),
('Magic Pearl', 'Grants wishes. Probably.', 800, 'https://imgur.com/v7OkFvu.png'),
('Kammarkör Emblem', 'A decorative crest of Norrlands Nation’s Kammarkör.', 1957, 'https://i.imgur.com/lYS5OSn.png'),
('Subaquatic Cathedral', 'The grand Uppsala Cathedral fully submerged, echoing with ethereal organ sounds.', 30000, 'https://i.imgur.com/szb6oy5.png'),
('Sunken Norrlands Nation', 'The Norrlands Nation building lies underwater, still hosting surreal student parties.', 40000, 'https://i.imgur.com/MVEf8mC.png'),
('Goldfish Bartender', 'Expert in tiny cocktails, seen mixing drinks behind the bar at Orvars Krog.', 18000, 'https://i.imgur.com/dyW5RWg.png');

INSERT INTO dorms (address, username, password, xp) VALUES
('123 Reef Street', "Tom", "$2b$10$0Zolu3XNjHvJDiGq6DNPoO5BBZ/DNk7zvrBq/SnZF.gGkGmtuk3MS", 40000),
("uppsala", "hus-3-2", "$2b$10$75P7D9n4qnlvNCxu0wVQ4OQv4ehGNZBTMa4n5MwD235tGtvYlQzaa", 0);

INSERT INTO corridor_fishes (fishID, dormID) VALUES
(1, 1);

INSERT INTO corridor_hats (dormID, hatID) VALUES
(1, 1);

INSERT INTO corridor_specials (specialID, dormID) VALUES
(1, 1);

-- Equipped fishes for dorm 1
INSERT INTO equipped_fishes (dormID, fishID, position) VALUES
(1, 1, 1),
(1, 1, 2),
(1, 1, 3),
(1, 1, 4),
(1, 1, 5),
(1, 1, 6);

-- Equipped fishes for dorm 2
INSERT INTO equipped_fishes (dormID, fishID, position) VALUES
(2, 1, 1),
(2, 1, 2),
(2, 1, 3),
(2, 1, 4),
(2, 1, 5),
(2, 1, 6);

-- Hats equipped on dorm 1 fishes
INSERT INTO equipped_fish_hats (dormID, position, hatID) VALUES
(1, 1, 1),
(1, 2, 1),
(1, 3, 1),
(1, 4, 1),
(1, 5, 1),
(1, 6, 1);

-- Hats equipped on dorm 2 fishes
INSERT INTO equipped_fish_hats (dormID, position, hatID) VALUES
(2, 1, 1),
(2, 2, 1),
(2, 3, 1),
(2, 4, 1),
(2, 5, 1),
(2, 6, 1);

-- Equipped special for dorm 1
INSERT INTO equipped_special (dormID, specialID) VALUES
(1, 1),
(2, 2);

-- Equipped background for dorm 1
INSERT INTO equipped_background (dormID, background) VALUES
(1, 'https://i.imgur.com/9T34bA9.png');