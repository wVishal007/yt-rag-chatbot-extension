# evaluation/experiment_logs.py

import json
from datetime import datetime


class ExperimentLogger:

    def __init__(self, log_file="evaluation_logs.json"):
        self.log_file = log_file

    def log(self, question, precision, recall):

        entry = {
            "timestamp": str(datetime.now()),
            "question": question,
            "precision@k": precision,
            "recall@k": recall
        }

        try:
            with open(self.log_file, "r") as f:
                data = json.load(f)
        except:
            data = []

        data.append(entry)

        with open(self.log_file, "w") as f:
            json.dump(data, f, indent=4)