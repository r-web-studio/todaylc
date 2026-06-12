from aiogram.fsm.state import State, StatesGroup


class EnrollState(StatesGroup):
    name = State()
    phone = State()
    category = State()
    course = State()
    confirm = State()
