
class Price(object):

    def __init__(self, name='name', colors=[]):
        self.name = name
        self.colors = colors

    def make_dictionary(self):

        return {
            "name": self.name,
            "colors": self.colors
        }
