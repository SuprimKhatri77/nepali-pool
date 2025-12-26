import {
  ConnectStudentProfileSelectType,
  UserSelectType,
} from "../../../../lib/db/schema";
import { StudentCard } from "./StudentCards";

type Props = {
  students:
    | (ConnectStudentProfileSelectType & {
        user: UserSelectType | null;
      })[]
    | [];
};
export default function StudentCards({ students }: Props) {
  return (
    <section className="py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 sm:px-4">
        {/* receive from props */}
        {students.map((student, i) => (
          <StudentCard key={i} student={student} />
        ))}
      </div>
    </section>
  );
}
