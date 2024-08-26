<script>
	import Button from '$lib/components/Button.svelte';
	import Form from '$lib/components/forms/Form.svelte';
	import Input from '$lib/components/forms/Input.svelte';
</script>

<div class="flex flex-col items-start gap-4 p-4 text-xl">
	<h1>Components</h1>
	<p>
		This is a paragraph! aoifj doifga fgah dofas dfoasdhf aosdf+sod <br /> sdpofjasdof sdfjaspdfaopdfj
		asdofpjadf
	</p>
	<h2>Forms</h2>

	<Button variant="primary">Button</Button>

	<Button variant="secondary">Button Secondary</Button>

	<h2>Forms</h2>

	<Form method="post" class="flex flex-col gap-2">
		<label>
			Email:
			<Input type="email" icon="i-mdi-email" />
		</label>

		<label>
			Password:
			<Input type="password" />
		</label>

		<label>
			Checkbox
			<Input type="checkbox" />
		</label>

		<label>
			Radio
			<Input type="radio" />
		</label>

		<Button>Submit</Button>
	</Form>
</div>
