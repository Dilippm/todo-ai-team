{{- define "todo-ai-team.mongo.fullname" -}}
{{- printf "%s-mongo" .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}