from app import db


class EveType(db.Model):
    __tablename__ = 'eve_types'
    id = db.Column(db.BigInteger, primary_key=True)
    group_id = db.Column(db.BigInteger)
    market_group_id = db.Column(db.BigInteger)
    volume = db.Column(db.Float)
    name = db.Column(db.String)
    portion_size = db.Column(db.BigInteger)
    published = db.Column(db.Boolean)


class EveMarketGroup(db.Model):
    __tablename__ = 'eve_market_groups'
    id = db.Column(db.BigInteger, primary_key=True)
    description = db.Column(db.String)
    has_types = db.Column(db.Boolean)
    name = db.Column(db.String)
    icon_id = db.Column(db.BigInteger)
    parent_id = db.Column(db.BigInteger)


class EveGroup(db.Model):
    __tablename__ = 'eve_groups'
    id = db.Column(db.BigInteger, primary_key=True)
    category_id = db.Column(db.BigInteger)
    icon_id = db.Column(db.BigInteger)
    published = db.Column(db.Boolean)
    name = db.Column(db.String)


class EveCategory(db.Model):
    __tablename__ = 'eve_categories'
    id = db.Column(db.BigInteger, primary_key=True)
    icon_id = db.Column(db.BigInteger)
    published = db.Column(db.Boolean)
    name = db.Column(db.String)


class EveTypeAttribute(db.Model):
    __tablename__ = 'eve_type_attributes'
    type_id = db.Column(db.BigInteger, primary_key=True)
    attribute_id = db.Column(db.BigInteger, primary_key=True)
    value = db.Column(db.Float)


class EveAttribute(db.Model):
    __tablename__ = 'eve_attributes'
    id = db.Column(db.BigInteger, primary_key=True)
    code = db.Column(db.String)
    name = db.Column(db.String)
    category_id = db.Column(db.BigInteger)
    default_value = db.Column(db.Float)
    description = db.Column(db.String)
    icon_id = db.Column(db.BigInteger)
    unit_id = db.Column(db.BigInteger)
    published = db.Column(db.Boolean)
    stackable = db.Column(db.Boolean)
    high_is_good = db.Column(db.Boolean)
