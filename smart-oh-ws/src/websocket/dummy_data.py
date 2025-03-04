import random

from .state import TBoard, TCard, TColumn, User

STUDENT_NAMES = [
    "Alice Johnson",
    "Bob Smith",
    "Charlie Brown",
    "David Wilson",
    "Emma Davis",
    "Fiona Garcia",
    "George Martinez",
    "Hannah Robinson",
    "Ian Clark",
    "Julia Lewis",
    "Kevin Walker",
    "Lily Hall",
    "Michael Allen",
    "Nina Young",
    "Oscar King",
    "Paula Wright",
    "Quentin Scott",
    "Rachel Adams",
    "Sam Nelson",
    "Tina Moore",
]

TA_NAMES = ["Dr. Anderson", "Ms. Baker", "Mr. Carter", "Prof. Daniels", "Dr. Evans"]


def generate_dummy_data():
    class_id = "class1"

    students = [
        TCard(
            user=User(
                id=f"student{j + 1}",
                name=STUDENT_NAMES[j],
                email=f"student{j + 1}@example.com",
            ),
            role="student",
        )
        for j in range(len(STUDENT_NAMES))
    ]

    tas = [
        TCard(
            user=User(
                id=f"ta{k + 1}",
                name=TA_NAMES[k],
                email=f"ta{k + 1}@example.com",
            ),
            role="TA",
        )
        for k in range(len(TA_NAMES))
    ]

    # Assign 1 TA per session instead of 3
    sessions = [
        TColumn(
            id=f"session{k + 1}",
            title=f"Session {k + 1}",
            cards=[random.choice(tas)],
        )
        for k in range(3)  # Fewer sessions
    ]

    return class_id, TBoard(
        classId=class_id,
        allUsers=students + tas,
        columns=[
            TColumn(id="queue", title="Queue", cards=students),
            *sessions,
            TColumn(id="session4", title="Session 4", cards=[]),
        ],
    )
