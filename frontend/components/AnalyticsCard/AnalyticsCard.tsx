import { MousePointerClick } from "lucide-react";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface Props {
    title: string;
    description?: string;
    data: number;
    icon: any;
}

function AnalyticsCard(props: Props) {
  return (
    <Card className="w-[250px]">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium">{props.title}</CardTitle>
        {props.icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{props.data}</div>
        {/* <p className="text-xs text-muted-foreground">
          <span className="text-green-600">+12.5%</span> from last week
        </p> */}
      </CardContent>
    </Card>
  );
}

export default AnalyticsCard;
